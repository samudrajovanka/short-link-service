import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { cors } from 'hono/cors'

import routes from '../src/routes'
import { clientErrorResponse, errorHandler } from "../src/utils/helpers/response"
import { logMiddleware } from "../src/middlewares/log"
import NotFoundError from "../src/exceptions/NotFoundError"
import { apiKeyMiddleware } from "../src/middlewares/apiKey"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

const allowedOrigins = (process.env.ALLOWED_CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean)

// MIDDLEWARES
app.use(cors({
  origin: allowedOrigins
}))
app.use(trimTrailingSlash())
app.use(logMiddleware)
app.use(apiKeyMiddleware)

// ROUTES
app.route('/', routes)

// ERROR HANDLER
app.notFound((c) => {
  return c.json(clientErrorResponse(new NotFoundError('Page not found')), 404)
})
app.onError(errorHandler)

export default handle(app)
