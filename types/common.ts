
export type JsonError = {
  code: number
  message: string
}

export type ApiBody<T> = T | { error: JsonError} 
