import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { v4 as uuidv4 } from "uuid";
import { AttributeTypes } from "types";
import { Web3 } from "web3";

export class RetrieveAuthentication extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Authentication"],
    summary: "Add an Authentication for a Identity",
    parameters: {
      uid: Path(String, {
        description: "The ID of the authentication",
      }),
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
    const { uid: authId } = data.params;
    console.log({ authId });

    const authData = await env.sanctum_link.get(`authentication:${authId}`);
    console.log(authData);

    await env.sanctum_link.delete(`authentication:${authId}`);

    if (!authData) {
      return Response.json(
        {
          success: false,
        },
        { status: 404 }
      );
    }

    return JSON.parse(authData);
  }
}
