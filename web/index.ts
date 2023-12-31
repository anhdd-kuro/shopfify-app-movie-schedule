// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express, { NextFunction, Request, Response } from "express";
import serveStatic from "serve-static";
import cors from "cors";

import shopify, { sqliteSessionStorage } from "./shopify";
import GDPRWebhookHandlers from "./gdpr";
import apiCollectionsRouter from "./routes/api.collections";
import { GraphqlQueryError, Session } from '@shopify/shopify-api';
import { verifyAppProxyHmac} from "./utils";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "", 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use(cors())

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

// app.get("foo", async (req, res) => {
//   console.log("asadadasdas")
//   res.status(200).send("data");
// });

app.get("/api/products", async (req, res) => {
  try {
    console.log("aaaaaa")
    const products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      status: "active",
      limit: 250,
      // fields: ['id', 'title', 'image', 'metafields']
    });
    res.status(200).send(products.data);

  } catch (error) {
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
    res.status(200).send(collections.data);

  } catch (error) {
    res.status(500).send(error)
  }
});

app.get("/api/movies", async (req, res) => {
  console.log(res.locals)
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session
    });
    // Get all collections with include images and metafields

    const result = await graphqlClient.query<{ data: any }>({
      data: {
        query: GET_MOVIES,
        variables: req.body,
      },
    });
    res.send(result.body.data);

  } catch (error) {
    res.status(500).send(error)
  }
});

app.get<{ query: string }>("/api/trailer_set", async (req, res) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session
    });

    // console.log("Request Body",req.body)
    const  { query } = req.query;

    const data = await graphqlClient.query({
      data: {
        query: GET_TRAILER_SET,
        variables: {
          query
        },
      },
    });


    res.send(data.body);
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      return res.status(500).send({ error });
    }
    throw error;
  }
});


app.use("/proxy/*", (req: Request, res: Response, next: NextFunction) => {
  console.log("verifyAppProxyHmac")

  if (verifyAppProxyHmac(req.query, process.env.SHOPIFY_API_SECRET)) {
      return next();
  }
  return res.status(403).json({ errorMessage: 'I don\t think so.' });
});

app.get("/proxy/user", async (req, res) => {
  // console.log(req)
  // console.log(process.env)
  if(!req.query.shop || typeof req.query.shop !== "string") return res.status(500).send("shop is required")
  // if(!req.query.logged_in_customer_id) return res.status(500).send("Please login first")

  const session = await sqliteSessionStorage.findSessionsByShop(req.query.shop);
  if(!session || session.length === 0) return res.status(500).send("Error")
  console.log(session)

  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session: session[0]
      // session: new Session( {
      //   id: "proxy",
      //   shop: req.query.shop,
      //   state: '',
      //   isOnline: false,
      //   scope: process.env.SCOPE,
      //   accessToken: process.env.SHOPIFY_PROXY_TOKEN,
      // })
    });
    // Get all collections with include images and metafields

    const randomString = (Math.random() + 1).toString(36).substring(7);


    const result = await graphqlClient.query<{ data: any }>({
      data: {
        query: UPDATE_USER,
        variables: {
          "input": {
            "id": "gid://shopify/Customer/7174989644050",
            "metafields": [
              {
                // key: "memo",
                "id": "gid://shopify/Metafield/29522858443026",
                "value": randomString
              }
            ]
          }
        },
      },
    });
    res.send(result.body.data);

  } catch (error) {
    console.log(error)
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

const GET_TRAILER_SET = `
query getTrailerSet($query: String!) {
  metaobjects(first: 20, type: "trailer_set",sortKey: "display_name",query: $query) {
    nodes {
      handle
      fields {
        key
        value
        type
        references(first: 10) {
          edges {
            node {
              ... on Metaobject {
              	handle,
                fields {
                  key
                  value
                }
              }
            }
          }
        }
        reference {
          ... on Metaobject {
            handle,
            fields {
              key
              value
            }
          }
        }
      }
    }
  }
}
`

const GET_MOVIES = `
query getMovies {
  metaobjects(first: 20, type: "movies") {
    nodes {
      handle
      id
      fields {
        key
        value
        references(first: 10) {
          nodes {
            ... on Product {
              id
              title
            }
            ... on Metaobject {
              handle
              id
              fields {
                key
                value
              }
            }
          }
        }
        reference {
          ... on MediaImage {
            image {
              altText
              url
            }
          }
        }
      }
    }
  }
}
`
const UPDATE_USER = `
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      email
      id
      metafields(first: 10) {
        nodes {
          key
          value
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`