import { get } from "lodash"
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Get } from "type-fest"

// Code from https://gist.github.com/panrafal/92e11be4401aee710d8616cf2b664c0d

export type NestedForm<TFieldValues extends FieldValues> = UseFormReturn<{
  __nested__: TFieldValues
}> & {
  path(this: void): `__nested__`
  path<TPath extends FieldPath<TFieldValues>>(
    this: void,
    p?: TPath,
  ): `__nested__.${TPath}`
  get<TObj>(this: void, obj: TObj): Get<TObj, `__nested__`, { strict: false }>
  get<TPath extends FieldPath<TFieldValues>, TObj>(
    this: void,
    obj: TObj,
    p?: TPath,
  ): Get<TObj, `__nested__.${TPath}`, { strict: false }>
}

export function nestedForm<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues> | NestedForm<TFieldValues>,
): NestedForm<TFieldValues>
export function nestedForm<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>,
>(
  form: UseFormReturn<TFieldValues> | NestedForm<TFieldValues>,
  path: TPath,
): NestedForm<Get<TFieldValues, TPath, { strict: false }>>
export function nestedForm(
  form: UseFormReturn<any> | NestedForm<any>,
  path?: string | number,
): NestedForm<any> {
  return {
    ...form,
    path(field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field
      if ("path" in form) return form.path(path as any)
      return (fullPath || "") as any
    },
    get(obj: any, field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field
      if ("get" in form) return form.get(path)
      return fullPath ? get(obj, fullPath) : obj
    },
  }
}
