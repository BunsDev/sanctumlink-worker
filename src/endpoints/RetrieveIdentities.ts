import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";

export class RetrieveIdentities extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Identity"],
    summary: "Get all Identities",
    responses: {
      "200": {
        schema: [
          {
            IdentityId: String,
            Email: String,
            Account: String,
            CreatedAt: String,
          },
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
    const identities = await env.sanctumdb
      .prepare("SELECT * FROM Identities")
      .all();
    // console.log(identity);

    return identities.results;
  }
}
