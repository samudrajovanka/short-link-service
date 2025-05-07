import { Context } from "hono";
import { PaginationParams } from "../validators/paginationParams";

export const getPaginationFromQuery = (c: Context) => {
  // @ts-ignore
  const query = c.req.valid('query') as PaginationParams

  const offset = (query.page - 1) * query.limit;

  return {
    page: query.page,
    limit: query.limit,
    offset,
  };
}

export type Pagination = ReturnType<typeof getPaginationFromQuery>;

export const getPaginationMetaResponse = (pagination: Pagination, total: number) => {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit)
  }
}

export type PaginationMetaResponse = ReturnType<typeof getPaginationMetaResponse>;
