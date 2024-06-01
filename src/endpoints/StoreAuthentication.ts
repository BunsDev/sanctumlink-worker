import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { v4 as uuidv4 } from "uuid";
import { AttributeTypes } from "types";
import { Web3 } from "web3";

export class StoreAuthentication extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Authentication"],
    summary: "Add an Authentication for a Identity",
    requestBody: {
      identityId: String,
      attributes: [
        {
          AttributeType: String,
          AttributeValue: String,
          AttributeHash: String,
        },
      ],
    },
    responses: {
      "200": {
        description: "Returns",
        schema: {
          authId: String,
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const { identityId, attributes } = data.body;
    console.log({ identityId, attributes });

    const authId = uuidv4();

    await env.sanctum_link.put(
      `authentication:${authId}`,
      JSON.stringify({
        identityId,
        attributes,
      }),
      { expirationTtl: 30 * 60 }
    );

    return {
      authId,
    };
  }
}
