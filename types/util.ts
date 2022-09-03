export type NullPartialDeep<T> = T extends object
  ? {
      [P in keyof T]: NullPartialDeep<T[P]> | null
    }
  : T

export type NullPartial<T> = {
  [P in keyof T]: T[P] | null
}
