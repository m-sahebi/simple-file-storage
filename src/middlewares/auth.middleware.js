import { decodeJwt } from "../utils/helpers.js";
import { AUTHORIZED_ACCESS } from "../configs/app.config.js";

export async function authMiddleware(req, res, next) {
  if (AUTHORIZED_ACCESS && req.method !== "GET") {
    const token = await decodeJwt(req.query.token);
    if (!token) return res.status(401).end();
  }
  next();
}
