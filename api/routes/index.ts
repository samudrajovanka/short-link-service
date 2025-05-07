import { Hono } from "hono";
import appApi from "./api";

const app = new Hono()

app.route('/', appApi)

export default app;