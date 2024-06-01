import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { createCors } from "itty-router";

import { RegisterEmail } from "endpoints/RegisterEmail";
import { ConfirmationCode } from "endpoints/ConfirmationCode";
import { RetrieveIdentity } from "endpoints/RetrieveIdentity";
import { RetrieveProduct } from "endpoints/RetrieveProduct";
import { StoreIdentity } from "endpoints/StoreIdentity";
import { DropIdentity } from "endpoints/DropIdentity";
import { StoreAttribute } from "endpoints/StoreAttribute";
import { StoreAttributes } from "endpoints/StoreAttributes";
import { RetrieveAttributes } from "endpoints/RetrieveAttributes";
import { RetrieveIdentities } from "endpoints/RetrieveIdentities";

export const router = OpenAPIRouter({
  docs_url: "/openapi",
});
const { preflight, corsify } = createCors();

// embed preflight upstream to handle all OPTIONS requests
router.all("*", preflight);

// router.post("/", );

// frontend api
router.post("/api/v1/confirmation", RegisterEmail);
router.post("/api/v1/confirmation/:uid", ConfirmationCode);

// contract api
router.get("/api/v1/identities", RetrieveIdentities);
router.post("/api/v1/identity/:uid", StoreIdentity);
router.post("/api/v1/identity/:uid/attribute", StoreAttribute);
router.post("/api/v1/identity/:uid/attributes", StoreAttributes);
router.get("/api/v1/identity/:uid/attributes", RetrieveAttributes);
router.get("/api/v1/identity/:uid", RetrieveIdentity);
router.delete("/api/v1/identity/:uid", DropIdentity);

// ecommerce api
router.get("/api/v1/product/:uid", RetrieveProduct);

// 404 for everything else
router.all("*", () =>
  Response.json(
    {
      success: false,
      error: "Route not found",
    },
    { status: 404 }
  )
);

export default {
  fetch: async (request, env, ctx) => {
    return router.handle(request, env, ctx).then(corsify);
  },
};
