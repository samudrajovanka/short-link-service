import { createMiddleware } from "hono/factory";
import AuthenticationError from "../exceptions/AuthenticationError";

export const apiKeyMiddleware = createMiddleware(async(c, next) => {
  const apiKey = c.req.header("X-API-KEY");

  if (apiKey !== process.env.API_KEY) {
    throw new AuthenticationError('Invalid API key')
  }
  
  await next()
})