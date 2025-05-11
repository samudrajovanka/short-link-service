import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { trimTrailingSlash } from 'hono/trailing-slash'

import routes from '../src/routes'
import { errorHandler } from "../src/utils/helpers/response"
import { logMiddleware } from "../src/middlewares/log"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

app.use(trimTrailingSlash())
app.use(logMiddleware)

app.route('/', routes)

app.onError(errorHandler)

export default handle(app)
