import {
  ControllerProps,
  FieldArray,
  FieldArrayPath,
  FieldPathByValue,
  FieldValues,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"

import { Button } from "components/ui"
import { Fieldset, FormGroup } from "components/ui/forms"
import { NullPartialFieldPresetFields } from "lib/fields"

import FieldArrayActions from "../FieldArrayActions"
import FieldMultiPresetInput from "./FieldMultiPresetInput"
import FieldPresetInput from "./FieldPresetInput"

type FieldPresetFieldArrayProps<
  TValue = unknown,
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<TValue>[] | null
    > = FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<TValue>[] | null
    >,
> = {
  label: string
  name: TFieldArrayName
  formMethods: UseFormReturn<TFieldValues>
  emptyPresetField: FieldArray<
    TFieldValues,
    TFieldArrayName
  > extends NullPartialFieldPresetFields<TValue>
    ? FieldArray<TFieldValues, TFieldArrayName>
    : never
  allowMultiple?: boolean
  valueInput: ControllerProps<TFieldValues>["render"]
}

const FieldPresetFieldArray = <
  TValue = unknown,
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<TValue>[] | null
    > = FieldArrayPath<TFieldValues> &
    FieldPathByValue<
      TFieldValues,
      NullPartialFieldPresetFields<TValue>[] | null
    >,
>(
  props: FieldPresetFieldArrayProps<TValue, TFieldValues, TFieldArrayName>,
) => {
  const {
    label,
    name,
    formMethods,
    emptyPresetField,
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
                  emptyPresetValueField={
                    (emptyPresetField as { value: TValue }).value ?? null
                  }
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
            onClick={() => arrayMethods.append(emptyPresetField)}
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
