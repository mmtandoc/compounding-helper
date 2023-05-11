import {
  ControllerProps,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPathByValue,
  FieldValues,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"

import { Button } from "components/ui"
import { Fieldset, FormGroup } from "components/ui/forms"
import { NullPartialFieldPresetFields } from "lib/fields"
import { GetElementType } from "types/util"

import FieldArrayActions from "../FieldArrayActions"
import FieldMultiPresetInput from "./FieldMultiPresetInput"
import FieldPresetInput from "./FieldPresetInput"

type GetPresetFieldValue<
  TFieldValues extends FieldValues,
  TFieldArrayPath extends FieldArrayPath<TFieldValues>,
> = GetElementType<
  Exclude<FieldArrayPathValue<TFieldValues, TFieldArrayPath>, null>
> extends NullPartialFieldPresetFields<infer O>
  ? O
  : never

type FieldPresetFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<unknown>[] | null
    > = FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<unknown>[] | null
    >,
> = {
  label: string
  name: TFieldArrayName
  formMethods: UseFormReturn<TFieldValues>
  emptyPresetValue?: GetPresetFieldValue<TFieldValues, TFieldArrayName>
  allowMultiple?: boolean
  valueInput: ControllerProps<TFieldValues>["render"]
}

const FieldPresetFieldArray = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<unknown>[] | null
    > = FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<unknown>[] | null
    >,
>(
  props: FieldPresetFieldArrayProps<TFieldValues, TFieldArrayName>,
) => {
  const {
    label,
    name,
    formMethods,
    emptyPresetValue = null,
    allowMultiple = false,
    valueInput,
  } = props

  const arrayMethods = useFieldArray({
    control: formMethods.control,
    name,
  })

  return (
    <>
      <Fieldset legend={label} className="field-presets">
        <div className="field-presets-list">
          <FormGroup className="field-presets-labels" row>
            <div>Labels</div>
            <div>Preset values</div>
          </FormGroup>
          {arrayMethods.fields.map((field, index) => (
            <FormGroup className="field-preset-item" row key={field.id}>
              {allowMultiple ? (
                <FieldMultiPresetInput
                  name={`${name}.${index}` as any}
                  formMethods={formMethods}
                  emptyPresetValueField={emptyPresetValue}
                  valueInput={valueInput}
                />
              ) : (
                <FieldPresetInput
                  name={`${name}.${index}`}
                  formMethods={formMethods}
                  arrayMethods={arrayMethods as any} //TODO: Fix typing
                  valueInput={valueInput}
                />
              )}

              <FieldArrayActions
                arrayMethods={arrayMethods}
                field={field}
                index={index}
              />
            </FormGroup>
          ))}
        </div>
        <div className="actions">
          <Button
            size="small"
            onClick={
              () =>
                arrayMethods.append({
                  label: null,
                  value: emptyPresetValue,
                } as any) // TODO: Fix typing
            }
          >
            Add new preset
          </Button>
        </div>
      </Fieldset>
      <style jsx global>{`
        .field-presets-list {
          display: grid;
          grid-template-columns: auto 1fr 2fr auto;
          column-gap: 1rem;

          > .field-presets-labels {
            font-weight: 600;

            &::before,
            &::after {
              content: "";
            }
          }

          > .field-preset-item {
            &::before {
              display: inline-block;
              content: "•";
            }

            > .form-group {
              display: contents !important;
            }
          }

          > div.form-group {
            display: contents !important;
            width: 100%;
          }
        }

        .field-presets > .actions {
          margin-top: 1rem;
        }
      `}</style>
    </>
  )
}

export default FieldPresetFieldArray
