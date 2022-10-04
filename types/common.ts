import { FieldValues, UseFormReturn } from "react-hook-form"
import { Simplify } from "type-fest"

export type JsonError = {
  code: number
  message: string
}

export type ApiBody<T> = T | { error: Simplify<JsonError> }

export type DataEntryComponent<
  TFieldValues extends FieldValues,
  TEntryProps extends { formMethods: UseFormReturn<TFieldValues> } = Record<
    string,
    unknown
  > & { formMethods: UseFormReturn<TFieldValues> },
> = (props: TEntryProps) => JSX.Element
