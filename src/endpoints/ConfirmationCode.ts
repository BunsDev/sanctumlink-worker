import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";

export class ConfirmationCode extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Confirmation"],
    summary: "Create a new Code Confirmation",
    requestBody: {
      type: String,
      value: String,
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

    if(confirmationData.type === 'EMAIL') {
        await env.sanctum_link.put(`confirmation:${randomUUID}`, JSON.stringify({
            code,
            email: confirmationData.value,
            type: 'EMAIL',
        }));
        await sendEmail(confirmationData.value, code.toFixed(0), env);
    }

    // const kvVal = await env.sanctum_link.get("key1");

    // return the new task
    return {
      success: true,
      task: {
        uid: randomUUID,
      },
    };
  }
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

async function sendEmail(email: string, code: string, env: any) {

  const form = new FormData();
  form.append("from", "sanctumlink@joinwebmobix.tech");
  form.append("to", email);
  form.append("subject", "Confirm Email");
  form.append("text", `Confirmation code: ${code}`);

  const resp = await fetch(
    `https://api.eu.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
      },
      body: form,
    }
  );

  console.log(resp)
}
