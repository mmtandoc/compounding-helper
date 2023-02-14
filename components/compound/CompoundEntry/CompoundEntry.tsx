import { useEffect, useMemo } from "react"
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form"
import useSWR from "swr"

import { Button } from "components/ui"
import {
  Fieldset,
  FormGroup,
  Input,
  RhfBooleanRadioGroup,
  TextArea,
} from "components/ui/forms"
import {
  NullPartialCompoundFields,
  NullPartialIngredientFields,
  SettingsFields,
} from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"

import { getHwngShortcutString } from "../helpers"
import IngredientEntry from "../ingredient/IngredientEntry"
import ShortcutVariationsEntry from "./ShortcutVariationsEntry"

type Props = {
  formMethods: UseFormReturn<NullPartialCompoundFields>
  showPastSdsRevisions?: boolean
  display?: "all" | "partial"
}

const emptyIngredientValues: NullPartialIngredientFields = {
  order: NaN,
  chemicalId: null,
  physicalForm: null,
  sdsId: null,
  isCommercialProduct: null,
  commercialProduct: {
    name: null,
    din: null,
    hasNoDin: null,
    hasProductMonographConcerns: null,
    concernsDescription: null,
  },
}

const CompoundEntry = (props: Props) => {
  const { formMethods, showPastSdsRevisions = false, display = "all" } = props

  const { register, control, watch } = formMethods

  const ingredientsArrayMethods = useFieldArray({
    control: control,
    name: "ingredients",
  })

  const ingredientFields = ingredientsArrayMethods.fields

  const ingredients = watch("ingredients")

  useEffect(() => {
    if (
      ingredients &&
      ingredients.length === 0 &&
      ingredientFields.length === 0
    ) {
      ingredientsArrayMethods.append(emptyIngredientValues)
    }
  }, [ingredients, ingredientFields, ingredientsArrayMethods])

  const shortcut = useWatch({ control, name: "shortcut" })
  const compoundId = watch("id")
  const shortcutVariations = shortcut?.hasShortcut
    ? shortcut?.variations
    : undefined
  const shortcutSuffix = shortcut?.hasShortcut ? shortcut?.suffix : undefined

  const hasShortcut = watch("shortcut.hasShortcut")

  const shortcutString = useMemo(
    () =>
      getHwngShortcutString(
        compoundId,
        shortcutVariations?.filter<{
          code: string
          name: string
        }>((v): v is { code: string; name: string } => !!v.code && !!v.name),
        shortcutSuffix,
      ),
    [compoundId, shortcutSuffix, shortcutVariations],
  )

  const { data: settings, error: settingsError } =
    useSWR<SettingsFields>("/api/settings")

  if (settingsError) {
    console.error(settingsError)
  }

  const shortcutSuffixes = useMemo(() => settings?.shortcutSuffixes, [settings])

  register("id")
  return (
    <>
      <FormGroup>
        <label htmlFor="compound-name">Compound name:</label>
        <Input
          id="compound-name"
          type="text"
          {...register("name")}
          autoComplete="off"
          size={40}
        />
      </FormGroup>
      <Fieldset legend="Ingredients:">
        {ingredientFields.map((field, index) => (
          <IngredientEntry
            key={field.id}
            field={field}
            index={index}
            name={"ingredients"}
            formMethods={nestedForm(
              formMethods,
              `ingredients.${index}` as "ingredients.0",
            )}
            arrayMethods={ingredientsArrayMethods}
            reset={() => {
              formMethods.resetField(`ingredients.${index}`, {
                defaultValue: emptyIngredientValues,
              })
            }}
            showPastSdsRevisions={showPastSdsRevisions}
          />
        ))}
        <div>
          <Button
            className="add-button"
            size="small"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append(emptyIngredientValues)
            }
          >
            Add Ingredient
          </Button>
        </div>
      </Fieldset>
      {display === "all" && (
        <>
          <FormGroup>
            <label htmlFor={`has-shortcut`}>Has HWNG shortcut?</label>
            <RhfBooleanRadioGroup
              id={`has-shortcut`}
              name={"shortcut.hasShortcut"}
            />
          </FormGroup>
          {hasShortcut && (
            <Fieldset legend="HWNG Shortcut:">
              <ShortcutVariationsEntry formMethods={formMethods} />
              <FormGroup row>
                <label htmlFor="shortcut-suffix">Suffix:</label>
                <FormGroup row>
                  <Input
                    type="text"
                    id="shortcut-suffix"
                    {...register("shortcut.suffix")}
                    list={`shortcut-suffixes-list`}
                  />
                  {shortcutSuffix &&
                    shortcutSuffixes?.find((s) => s.code === shortcutSuffix) !==
                      undefined && (
                      <span>
                        {
                          shortcutSuffixes.find(
                            (s) => s.code === shortcutSuffix,
                          )?.description
                        }
                      </span>
                    )}
                  <datalist id={`shortcut-suffixes-list`}>
                    {shortcutSuffixes?.map(({ code, description }) => (
                      <option
                        value={code}
                        key={code}
                      >{`${code} - ${description}`}</option>
                    ))}
                  </datalist>
                </FormGroup>
              </FormGroup>
              <FormGroup row className="shortcut-preview">
                <span className="label">Shortcut preview:</span>
                <span className="shortcut">{shortcutString}</span>
              </FormGroup>
            </Fieldset>
          )}
          <FormGroup>
            <label htmlFor="notes">Notes:</label>
            <TextArea id="notes" {...register("notes")} />
          </FormGroup>
        </>
      )}
      <style jsx global>{`
        .shortcut-variations {
          margin-bottom: 0.8rem;
        }

        #shortcut-suffix {
          text-transform: uppercase;
        }
        .shortcut-preview {
          margin-top: 2rem;

          > .shortcut {
            text-transform: uppercase;
          }
        }
      `}</style>
    </>
  )
}

export default CompoundEntry
