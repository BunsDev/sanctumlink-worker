import {
    OpenAPIRoute,
    OpenAPIRouteSchema,
    Path,
  } from "@cloudflare/itty-router-openapi";
  
  export class RetrieveAttributes extends OpenAPIRoute {
    static readonly schema: OpenAPIRouteSchema = {
      tags: ["Identity"],
      summary: "Get Attributes for an Identity",
      parameters: {
        uid: Path(String, {
          description: "The ID of the identity",
        }),
      },
      responses: {
        "200": {
          description: "Returns the attributes",
          schema: [
            {
                AttrbuteType: String,
                AttributeValue: String,
                AttributeHash: String,
                CreatedAt: String,
            }
          ],
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
  
      const identity = await env.sanctumdb
      .prepare(
        "SELECT * FROM Identities WHERE IdentityId = ?1"
      )
      .bind(identityId)
      .first();
      console.log(identity);
  
      const { results: attributes } = await env.sanctumdb
      .prepare(
        "SELECT * FROM Attributes WHERE IdentityId = ?1"
      )
      .bind(identityId)
      .all();
  
      console.log(attributes)
  
      return attributes.map((a) => ({
        AttributeType: a.AttributeType,
        AttributeValue: a.AttributeValue,
        AttributeHash: a.AttributeHash,
        CreatedAt: a.CreatedAt,
      }));
    }
  }
  