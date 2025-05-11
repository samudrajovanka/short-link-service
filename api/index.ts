import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { trimTrailingSlash } from 'hono/trailing-slash'

import routes from '../src/routes'
import { clientErrorResponse, errorHandler } from "../src/utils/helpers/response"
import { logMiddleware } from "../src/middlewares/log"
import NotFoundError from "../src/exceptions/NotFoundError"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

// MIDDLEWARES
app.use(trimTrailingSlash())
app.use(logMiddleware)

// ROUTES
app.route('/', routes)

// ERROR HANDLER
app.notFound((c) => {
  return c.json(clientErrorResponse(new NotFoundError('Page not found')), 404)
})
app.onError(errorHandler)

export default handle(app)
