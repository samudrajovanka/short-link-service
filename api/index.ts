import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import routes from './routes'
import { errorHandler } from "./utils/helpers/response"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

app.route('/', routes)

app.onError(errorHandler)

export default handle(app)
