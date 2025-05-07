import { createFactory } from 'hono/factory'
import { successResponse } from "../../utils/helpers/response"
import { zPaginationParamsValidator } from "../../utils/validators/paginationParams"
import { zCreateShortLinkValidator, zUpdateShortLinkValidator } from "./shortLink.validator"
import { getPaginationFromQuery } from "../../utils/helpers/pagination"
import ShortLinkService from "./shortLink.service"

const {
  createHandlers
} = createFactory()

export const getShortLinks = createHandlers(
  zPaginationParamsValidator,
  async (c) => {
    const pagination = getPaginationFromQuery(c);

    const shortLinksService = new ShortLinkService()
    const { shortLinks, meta } = await shortLinksService.getAll({
      pagination
    })

    return c.json(successResponse({
      message: 'success get all short links',
      data: {
        shortLinks,
      },
      meta
    }))
})

export const createShortLink = createHandlers(
  zCreateShortLinkValidator,
  async (c) => {
    const payload = c.req.valid('json');

    const shortLinkService = new ShortLinkService();
    const shortLink = await shortLinkService.create(payload);

    return c.json(successResponse({
      message: 'success create short link',
      data: {
        id: shortLink.id,
      }
    }))
  }
)

export const getShortLinkBySlug = createHandlers(
  async (c) => {
    const slug = c.req.param('slug') as string

    const shortLinkService = new ShortLinkService()
    const shortLink = await shortLinkService.getBySlug(slug)

    return c.json(successResponse({
      message: 'success get short link',
      data: {
        shortLink
      }
    }))
  }
)

export const getShortLinkAccess = createHandlers(
  async (c) => {
    const slug = c.req.param('slug') as string

    const shortLinkService = new ShortLinkService()
    const shortLink = await shortLinkService.accessBySlug(slug)

    return c.json(successResponse({
      message: 'success get short link',
      data: {
        shortLink
      }
    }))
  }
)

export const deleteShortLinkBySlug = createHandlers(
  async (c) => {
    const slug = c.req.param('slug') as string

    const shortLinkService = new ShortLinkService()
    await shortLinkService.deleteBySlug(slug)

    return c.json(successResponse({
      message: 'success delete short link',
    }))
  }
)

export const updateShortLinkBySlug = createHandlers(
  zUpdateShortLinkValidator,
  async (c) => {
    const slug = c.req.param('slug') as string
    const payload = c.req.valid('json')

    const shortLinkService = new ShortLinkService()
    await shortLinkService.updateBySlug(slug, payload)

    return c.json(successResponse({
      message: 'success update short link',
    }))
  }
)
