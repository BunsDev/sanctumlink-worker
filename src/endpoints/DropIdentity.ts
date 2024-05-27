import {
    OpenAPIRoute,
    OpenAPIRouteSchema,
    Path,
  } from "@cloudflare/itty-router-openapi";
  import { AttributeTypes } from "types";
  import { Web3 } from "web3";
  
  export class DropIdentity extends OpenAPIRoute {
    static readonly schema: OpenAPIRouteSchema = {
      tags: ["Identity"],
      summary: "Drop an Identity",
      parameters: {
        uid: Path(String, {
          description: "The ID of the identity",
        }),
      },
      responses: {
        "200": {
          description: "",
        },
      },
    };
  
    async handle(
      request: Request,
      env: any,
      context: any,
      data: Record<string, any>
    ) {
      const { uid: identityId } = data.params;
      console.log({ identityId });
  
      try {
          // identity entry
        const info = await env.sanctumdb
          .prepare(
            "DELETE FROM Identities WHERE IdentityId = ?1"
          )
          .bind(identityId)
          .run();
          console.log(info);
      } catch (e) {
        console.error(e);
      }
  
      return {
        success: true,
      };
    }
  }
  