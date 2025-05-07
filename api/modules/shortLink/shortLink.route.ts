import { Hono } from "hono";
import {
  createShortLink,
  deleteShortLinkBySlug,
  getShortLinkAccess,
  getShortLinkBySlug,
  getShortLinks,
  updateShortLinkBySlug
} from "./shortLink.controller";

const shortLinkRoute = new Hono()

shortLinkRoute
  .get('/', ...getShortLinks)
  .post('/', ...createShortLink)
  .get('/:slug', ...getShortLinkBySlug)
  .get('/:slug/access', ...getShortLinkAccess)
  .delete('/:slug', ...deleteShortLinkBySlug)
  .patch('/:slug', ...updateShortLinkBySlug)

export default shortLinkRoute