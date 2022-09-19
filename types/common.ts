import { Simplify } from "type-fest"

export type JsonError = {
  code: number
  message: string
}

export type ApiBody<T> = T | { error: Simplify<JsonError> }
