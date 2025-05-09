import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { trimTrailingSlash } from 'hono/trailing-slash'

import routes from '../src/routes'
import { errorHandler } from "../src/utils/helpers/response"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

app.use(trimTrailingSlash())
app.route('/', routes)

app.onError(errorHandler)

export default handle(app)
