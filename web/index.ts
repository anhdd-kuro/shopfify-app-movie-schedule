// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express, { Request, Response } from "express";
import serveStatic from "serve-static";

import shopify from "./shopify";
import GDPRWebhookHandlers from "./gdpr";
import apiCollectionsRouter from "./routes/api.collections";
import { GraphqlQueryError } from '@shopify/shopify-api';

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

app.get("/api/discounts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session
    });

    const data = await graphqlClient.query<any>({
      data: {
        query: GET_DIS1COUNT,
        variables: { id: `gid://shopify/DiscountAutomaticNode/${id}` },
      },
    });

    // console.log(data)
    const { discount, metafield } = data.body.data.discountNode;

    if (!discount) {
      return res.status(404).send({ error: "Discount not found" });
    }

    const { title } = discount;
    const parsedMetafield = JSON.parse(metafield.value);

    const response = {
      title,
      ...parsedMetafield
    };

    res.send(response);
  } catch (error) {
    res.status(500).send(error)
    // Handle errors thrown by the GraphQL client
    // if (!(error instanceof GraphqlQueryError)) {
    //   throw error;
    // }
    // return res.send({ error: error.response });
  }
});


const runDiscountMutation = async (req: Request, res: Response, mutation: string) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session
    });

    console.log("Request Body",req.body)

    const data = await graphqlClient.query({
      data: {
        query: mutation,
        variables: req.body,
      },
    });


    res.send(data.body);
  } catch (error) {
    // Handle errors thrown by the GraphQL client
    if (error instanceof GraphqlQueryError) {
      // throw error;
      // res.status(500).send({ error: "失敗しました" });
      return res.status(500).send({ error });
    }
    throw error;
  }
};

// Endpoint to create code-based discounts
app.post("/api/discounts/code", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_CODE_MUTATION);
});
// Endpoint to create automatic discounts
app.post("/api/discounts/automatic", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_AUTOMATIC_MUTATION);
});

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
  console.log(res.locals)
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

const CREATE_CODE_MUTATION = `
  mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {
    discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const CREATE_AUTOMATIC_MUTATION = `
  mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
    discountCreate: discountAutomaticAppCreate(
      automaticAppDiscount: $discount
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const GET_DIS1COUNT = `
  query getDiscount($id: ID!) {
    discountNode(id: $id) {
      id
      discount {
        ... on DiscountAutomaticApp {
          title
        }
      }
      metafield(namespace: "volume-discount", key: "function-configuration") {
        value
      }
      metafields(first: 10) {
        edges {
          node {
            id
            key
            description
            value
          }
        }
      }
    }
  }
`
