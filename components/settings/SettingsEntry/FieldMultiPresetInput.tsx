import {
  Controller,
  ControllerProps,
  FieldArrayPath,
  FieldPathByValue,
  FieldValues,
  Path,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"
import { BiPlus } from "react-icons/bi"
import { MdClose } from "react-icons/md"

import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import IconButton from "components/common/IconButton"
import { NullPartialFieldPresetFields } from "lib/fields"

type FieldMultiPresetInputProps<
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
  name: `${TFieldArrayName}.${number}`
  formMethods: UseFormReturn<TFieldValues>
  emptyPresetValueField: TValue
  valueInput: ControllerProps<TFieldValues>["render"]
}

const FieldMultiPresetInput = <
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
  props: FieldMultiPresetInputProps<TValue, TFieldValues, TFieldArrayName>,
) => {
  const {
    name,
    formMethods,
    emptyPresetValueField,
    valueInput: ValueInput,
  } = props

  const arrayMethods = useFieldArray({
    name: `${name}.value` as FieldArrayPath<TFieldValues>,
    control: formMethods.control,
  })

  return (
    <>
      <FormGroup className="field-multipreset" row>
        <Input
          {...formMethods.register(`${name}.label` as Path<TFieldValues>)}
          fullWidth
        />
        <div className="multipreset-value-list">
          {arrayMethods.fields.map((field, index) => (
            <FormGroup className="multipreset-value-item" key={field.id} row>
              <Controller
                control={formMethods.control}
                name={`${name}.value.${index}` as Path<TFieldValues>}
                render={ValueInput}
              />
              <div className="row-actions">
                <IconButton
                  title="Remove"
                  icon={MdClose}
                  disabled={arrayMethods.fields.length === 1}
                  onClick={() => arrayMethods.remove(index)}
                  size="small"
                />
              </div>
            </FormGroup>
          ))}
          <div className="actions">
            <IconButton
              icon={BiPlus}
              size="small"
              onClick={() => arrayMethods.append(emptyPresetValueField as any)}
            >
              Add another
            </IconButton>
          </div>
        </div>
      </FormGroup>
      <style jsx global>{`
        .field-multipreset {
          .multipreset-value-list {
            border-bottom: var(--border-default);
            margin-bottom: 0.3rem;
            padding-bottom: 0.3rem;
          }

          .multipreset-value-item {
            align-items: center;

            > div:first-child {
              width: 100%;
              > * {
                flex-grow: 1;
              }
            }

            > .row-actions {
              display: flex;
            }
          }
        }
      `}</style>
    </>
  )
}

export default FieldMultiPresetInput
