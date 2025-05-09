import { Hono } from "hono";
import shortLinkRoute from "@/modules/shortLink/shortLink.route";

const apiApp = new Hono().basePath('/api')

apiApp.route('/short-links', shortLinkRoute)

export default apiApp