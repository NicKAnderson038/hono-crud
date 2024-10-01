import { Hono } from "hono";
// import { validator } from "hono/validator";
import { ttlCache } from "../../utils/tokenBlackList.js";

export const admin = new Hono()
  // .use(adminRoleRouteValidation) // all these routes will check for admin role
  .get("/", (c) => new Response("Admin Health Check 🥦: Api's are running 🍻"))
  // .get('/check-black-list', validator('header', adminRoleRouteValidation), async c => {
  //     const payload = c.get('jwtPayload')
  //     console.log(ttlCache.max)
  //     console.log(payload)
  //     return c.json(payload)
  // })
  .get("/check-black-list", async (c) => {
    const payload = c.get("jwtPayload");
    console.log(ttlCache.max);
    console.log(payload);
    return c.json(payload);
  });
