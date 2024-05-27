import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { Web3 } from "web3";

export class ConfirmationCode extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Confirmation"],
    summary: "Validate Code Confirmation",
    parameters: {
      uid: Path(String, {
        description: "The ID of the confirmation",
      }),
    },
    requestBody: {
      code: String,
    },
    responses: {
      "200": {
        description: "Returns the transaction",
        schema: {
          success: Boolean,
          result: {
            id: String,
          },
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
    const { uid: confirmationId } = data.params;
    // Retrieve the validated request body
    const sentCode = parseInt(data.body.code);
    console.log({ confirmationId, sentCode });

    const confirmationData = await env.sanctum_link.get(
      `confirmation:${confirmationId}`
    );
    console.log({ confirmationData });
    if (!confirmationData) {
      throw new Error("Invalid Confirmation");
    }
    const { code, value, type } = JSON.parse(confirmationData);
    const valueDigest = await crypto.subtle.digest(
      {
        name: "SHA-256",
      },
      new TextEncoder().encode(value.trim())
    );

    console.log("before check", { code, value, type, sentCode });

    if (sentCode === code) {
      // remove confirmation
      await env.sanctum_link.delete(`confirmation:${confirmationId}`);
      //

      let valueHash = "";
      let valueHashSignature = "";
      try {
        // valueHash = Buffer.from(valueDigest).toString("hex");
        console.log(valueDigest)
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
        // const backendAccount = web3.eth.accounts.privateKeyToAccount(env.BACKEND_PRIVATE_KEY);
        valueHashSignature = web3.eth.accounts.sign(
          valueHash,
          env.BACKEND_PRIVATE_KEY
        ).signature;
        // 
        const ud = new Uint8Array(valueDigest)
        ud.forEach((b:number, idx:number) => {
            // console.log(idx, b, b.toString(16))
            const h = ("0"+ b.toString(16)).slice(-2)
            valueHash += h
        })
        console.log(`valueHash`, valueHash)
      } catch (e) {
        console.error(e);
      }

      //
      return {
        success: true,
        result: {
          type,
          value,
          valueHash,
          valueHashSignature: valueHashSignature,
        },
      };
    }

    return Response.json(
      {
        success: false,
      },
      { status: 400 }
    );
  }
}

function bytes2hex(bytes) {
  return Array.prototype.map((byte) => ("0" + byte.toString(16)).slice(-2))
    .join("");
}
