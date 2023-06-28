
import shopify from "../shopify";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/collections", async (req, res) => {
  try {
    const collections = await shopify.api.rest.SmartCollection.all({
      session: res.locals.shopify.session,
    });
    res.status(200).send(collections);

  } catch (error) {
    res.status(500).send(error)
  }
});

export default apiRouter;