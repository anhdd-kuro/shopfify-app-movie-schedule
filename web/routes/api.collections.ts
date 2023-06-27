
import shopify from "../shopify";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/collections", async (req, res) => {
  const collections = await shopify.api.rest.customCollection.list({
    session: res.locals.shopify.session,
  });
  res.status(200).send(collections);
});

export default apiRouter;