import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import routes from '../src/routes'
import { errorHandler } from "../src/utils/helpers/response"

export const config = {
  runtime: 'edge'
}

const app = new Hono()

app.route('/', routes)

app.onError(errorHandler)

export default handle(app)
