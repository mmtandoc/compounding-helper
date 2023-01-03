import {
  ControllerProps,
  FieldArray,
  FieldArrayPath,
  FieldValues,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"

import Button from "components/common/Button"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"

import FieldPresetInput from "./FieldPresetInput"

type FieldPresetFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = {
  label: string
  name: TFieldArrayName
  formMethods: UseFormReturn<TFieldValues>
  emptyPresetField: FieldArray<TFieldValues, TFieldArrayName>
  valueInput: ControllerProps<TFieldValues>["render"]
}
const FieldPresetFieldArray = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(
  props: FieldPresetFieldArrayProps<TFieldValues, TFieldArrayName>,
) => {
  const { label, name, formMethods, emptyPresetField, valueInput } = props

  const arrayMethods = useFieldArray({
    control: formMethods.control,
    name,
  })

  return (
    <>
      <Fieldset legend={label} className="field-presets">
        <div className="field-presets-list">
          <FormGroup className="field-presets-labels">
            <div>Labels</div>
            <div>Preset values</div>
          </FormGroup>
          {arrayMethods.fields.map((field, index) => (
            <FieldPresetInput
              key={field.id}
              field={field}
              index={index}
              name={name}
              formMethods={formMethods}
              arrayMethods={arrayMethods}
              valueInput={valueInput}
            />
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

          > div.form-group {
            display: contents;

            &:not(.field-presets-labels)::before {
              display: inline-block;
              content: "•";
            }
          }
        }

        .actions {
          margin-top: 1rem;
        }
      `}</style>
    </>
  )
}

export default FieldPresetFieldArray
