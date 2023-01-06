export type GetElementType<T extends unknown[]> = T extends (infer U)[]
  ? U
  : never
