/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod"

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.code === z.ZodIssueCode.invalid_type &&
    ["null", "nan", "undefined"].includes(issue.received)
  ) {
    return { message: "Required." }
  }
  if (
    issue.code === z.ZodIssueCode.too_small &&
    issue.type === "string" &&
    issue.minimum === 1
  ) {
    return { message: "Required." }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)
