import { useEffect } from "react"
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"

type useUpdateFieldConditionallyProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  updateCondition: boolean | undefined
  fields: [name: TFieldName, value: FieldPathValue<TFieldValues, TFieldName>][]
  register: UseFormRegister<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
}

const useUpdateFieldConditionally = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  updateCondition,
  fields,
  register,
  setValue,
}: useUpdateFieldConditionallyProps<TFieldValues, TFieldName>) => {
  useEffect(() => {
    if (updateCondition) {
      for (const [name, value] of fields) {
        register(name)
        setValue(name, value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, setValue, updateCondition, JSON.stringify(fields)])
}

export default useUpdateFieldConditionally
