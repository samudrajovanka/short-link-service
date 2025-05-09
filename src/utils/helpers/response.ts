import ErrorConstant from "../../constants/error"
import ClientError from "../../exceptions/ClientError"
import { PaginationMetaResponse } from "./pagination"
import { ContentfulStatusCode } from "hono/utils/http-status"
import { Context } from "hono"

type SuccessResponseParams = {
  message: string,
  data?: Record<string, unknown>
  meta?: {
    pagination?: PaginationMetaResponse
    [key: string]: unknown
  }
  [key: string]: unknown
}

export const successResponse = (params: SuccessResponseParams) => {
  return {
    success: true,
    ...params
  };
};

export const clientErrorResponse = (error: ClientError) => ({
  success: false,
  message: error.message,
  ...(error.validations && { validations: error.validations }),
  type: error.type,
});

export const serverErrorResponse = (error: Error) => ({
  success: false,
  message: error.message,
  type: ErrorConstant.type.SERVER_ERR,
  error: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
});

export const errorHandler = (error: Error, c: Context) => {
  console.log("Error", error)
  
  if (error instanceof ClientError) {
    return c.json(clientErrorResponse(error), error.statusCode as ContentfulStatusCode)
  }

  // if (error instanceof z.ZodError) {
  //   return res.status(400).json(clientErrorResponse(
  //     new InvariantError(getZodFirstMessageError(error.message)))
  //   );
  // }

  // if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //   if (error.code === PrismaConstant.errorCode.UNIQUE_CONSTRAINT) {
  //     const field = error.meta?.target ? (error.meta.target as Array<unknown>)[0] : '';

  //     return res.status(409).json(clientErrorResponse(
  //       new ConflictError(`${field} already exists`))
  //     );
  //   } else if (error.code === PrismaConstant.errorCode.RECORD_NOT_FOUND) {
  //     return res.status(404).json(clientErrorResponse(
  //       new NotFoundError('Record not found'))
  //     );
  //   } else if (error.code === PrismaConstant.errorCode.CONSTRAINT_VIOLATION) {
  //     const field = error.meta ? (error.meta.constraint as Array<unknown>)[0] : '';

  //     return res.status(409).json(clientErrorResponse(
  //       new ConflictError(`${field} already used`))
  //     );
  //   } else if (error.code === PrismaConstant.errorCode.FOREIGN_KEY_CONSTRAINT) {
  //     return res.status(400).json(clientErrorResponse(
  //       new InvariantError('Data in use')
  //     ));
  //   }
  // }

  // if (error instanceof Prisma.PrismaClientValidationError) {
  //   return res.status(400).json(clientErrorResponse(
  //     new InvariantError('Input data invalid to type in table database', {
  //       type: ErrorConstant.type.DATABASE_VALIDATION
  //     })
  //   ));
  // }

  // if (error instanceof ClientError) {
  //   return res.status(error.statusCode).json(clientErrorResponse(error));
  // }

  return c.json(serverErrorResponse(error), 500);
};
