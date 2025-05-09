import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { ValidationTargets } from "hono"
import ClientError from "@/exceptions/ClientError"
import ErrorConstant from "@/constants/error"

export const validationMiddleware = (target: keyof ValidationTargets, schema: z.ZodSchema) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const validationsError = result.error.errors.reduce((res, error) => {
        return {
          ...res,
          [error.path.join(".")]: error.message,
        }
      }, {} as Record<string, string>)

      throw new ClientError("Validation error", {
        type: ErrorConstant.type.VALIDATION_ERR,
        validations: validationsError,
      })
    }
  })
}
