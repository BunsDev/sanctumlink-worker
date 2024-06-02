import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { AttributeTypes } from "types";
import { Web3 } from "web3";

export class StoreAttributes extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Identity", "Attribute"],
    summary: "Add multiple Attributes to an Identity",
    parameters: {
      uid: Path(String, {
        description: "The ID of the identity",
      }),
    },
    requestBody: [
      {
        type: String,
        value: String,
        valueHash: String,
        signature: String,
      },
    ],
    responses: {
      "200": {
        description: "Returns",
        schema: {},
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
    const attributes = data.body;
    console.log({ identityId, attributes });

    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545"); // no interaction with a node needed here

    // validate signature of the value

    // const account  = web3.eth.accounts.recover('Some data', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c');
    // console.log(account)

    for (const attribute of attributes) {
      const {
        type: attributeType,
        value: attributeValue,
        valueHash: attributeHash,
        signature,
      } = attribute;
      try {
        // TODO: add on conflict
        const info = await env.sanctumdb
          .prepare(
            "INSERT INTO Attributes (IdentityId, AttributeType, AttributeValue, AttributeHash) VALUES (?1, ?2, ?3, ?4)"
          )
          .bind(identityId, attributeType, attributeValue, attributeHash)
          .run();
        console.log(info);
      } catch (e) {
        console.error(e);
      }
    }

    return {
      success: true,
    };
  }
}
