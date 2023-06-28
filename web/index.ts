// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify";
import GDPRWebhookHandlers from "./gdpr";
import apiCollectionsRouter from "./routes/api.collections";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "", 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });

    res.status(200).send(countData);
    // console.log(collections)
  } catch (error) {
    res.status(500).send(error)
  }
});

app.get("/api/collections", async (req, res) => {
  try {
    // Get all collections with include images and metafields
    const collections = await shopify.api.rest.SmartCollection.all({
      session: res.locals.shopify.session,
      // fields: ['id', 'title', 'image', 'metafields']
    });

    // const collections = await shopify.api.rest.SmartCollection.all({
    //   session: res.locals.shopify.session,
    // }).then((smartCollections) => {

    // };
    res.status(200).send(collections.data);

  } catch (error) {
    res.status(500).send(error)
  }
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);