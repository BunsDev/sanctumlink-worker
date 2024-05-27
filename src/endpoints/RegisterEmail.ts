import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { getRandomIntInclusive } from "utils";

export class RegisterEmail extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Register"],
    summary: "Create a new Code Confirmation",
    requestBody: {
      type: String,
      value: String,
      flow: String,
    },
    responses: {
      "200": {
        description: "Returns the created confirmation id",
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
    // Retrieve the validated request body
    const confirmationData = data.body;

    const randomUUID = crypto.randomUUID();
    const code = getRandomIntInclusive(100000, 999999);
    console.log(`generated code: ${code}`)

    if(confirmationData.type === 'EMAIL') {
        await env.sanctum_link.put(`confirmation:${randomUUID}`, JSON.stringify({
            code,
            value: confirmationData.value,
            type: 'EMAIL',
            flow: confirmationData.flow,
        }), { expirationTtl: 30 * 60 });
        // XXX: tmp skip sending email
        await sendEmail(confirmationData.value, code.toFixed(0), env);
    }

    // return the new task
    return {
      success: true,
      uid: randomUUID,
    };
  }
}

async function sendEmail(email: string, code: string, env: any) {

  const form = new FormData();
  form.append("from", "sanctumlink@joinwebmobix.tech");
  form.append("to", email);
  form.append("subject", "Confirm Email");
  form.append("text", `Confirmation code: ${code}`);

  const auth = btoa(`api:${env.MAILGUN_API_KEY}`);
  const resp = await fetch(
    `https://api.eu.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: form,
    }
  );

  console.log(resp)
}
