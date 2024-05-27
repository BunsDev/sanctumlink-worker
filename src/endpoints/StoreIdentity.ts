import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { AttributeTypes } from "types";
import { Web3 } from "web3";

export class StoreIdentity extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Identity"],
    summary: "Get Payload for an Identity",
    parameters: {
      uid: Path(String, {
        description: "The ID of the identity",
      }),
    },
    requestBody: {
      email: String,
      account: String,
      signature: String,
    },
    responses: {
      "200": {
        description: "Returns",
        schema: {},
      },
    },
  };

  storeAttribute = async (env: any, identityId, attributeType, attributeValue, attributeHash) => {
    return env.sanctumdb
    .prepare(
      "INSERT INTO Attributes (IdentityId, AttributeType, AttributeValue, AttributeHash) VALUES (?1, ?2, ?3, ?4)"
    )
    .bind(identityId,  attributeType, attributeValue, attributeHash)
    .run();
  }

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const { uid: identityId } = data.params;
    const { email, account, signature } = data.body;
    console.log({ identityId, email, account, signature });

    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545"); // no interaction with a node needed here

    // validate signature of email
    // validate signature of account

    // const account  = web3.eth.accounts.recover('Some data', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c');
    // console.log(account)

    try {
        // identity entry
      const info = await env.sanctumdb
        .prepare(
          "INSERT INTO Identities (IdentityId, Email, Account) VALUES (?1, ?2, ?3)"
        )
        .bind(identityId, email, account)
        .run();
        console.log(info);
        // attributes
        const info2 = await this.storeAttribute(env, identityId, AttributeTypes.PrimaryEmail, email, '')
        console.log(info2);
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
    };
  }
}
