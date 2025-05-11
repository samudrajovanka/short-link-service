import { z } from "zod";
import { validationMiddleware } from "../../middlewares/validation";

const originalUrlSchema = z
  .string({
    required_error: 'Original URL is required',
    invalid_type_error: 'Original URL must be a string',
  })
  .url('Original URL must be a valid URL')
  .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
    message: 'Original URL must start with http:// or https://',
  });

const slugSchema = z
  .string({
    required_error: 'Slug is required',
    invalid_type_error: 'Slug must be a string',
  })
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

export const createShortLinkValidator = z.object({
  originalUrl: originalUrlSchema,
  slug: slugSchema,
});

export const zCreateShortLinkValidator = validationMiddleware('json', createShortLinkValidator);

export const updateShortLinkValidator = z.object({
  originalUrl: originalUrlSchema,
  slug: slugSchema.optional(),
});

export const zUpdateShortLinkValidator = validationMiddleware('json', updateShortLinkValidator);