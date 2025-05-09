import { z } from "zod";
import { validationMiddleware } from "@/middlewares/validation";

export const createShortLinkValidator = z.object({
  originalUrl: z.string().url(),
  slug: z.string()
});

export const zCreateShortLinkValidator = validationMiddleware('json', createShortLinkValidator)

export const updateShortLinkValidator = z.object({
  originalUrl: z.string().url(),
  slug: z.string().optional()
})

export const zUpdateShortLinkValidator = validationMiddleware('json', updateShortLinkValidator)