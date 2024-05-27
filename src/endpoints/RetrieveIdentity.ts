import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";

export class RetrieveIdentity extends OpenAPIRoute {
  static readonly schema: OpenAPIRouteSchema = {
    tags: ["Identity"],
    summary: "Get Payload for an Identity",
    parameters: {
      uid: Path(String, {
        description: "The ID of the identity",
      }),
    },
    responses: {
      "200": {
        description: "Returns the identity",
        schema: {
          primaryEmail: String,
          nameOfUser: String,
          primaryPhone: String,
          dateOfBirth: String,
          birthCertificateDocument: String,
          countryOfBirth: String,
          nationalId: String,
          currentCountryOfResidence: String,
          currentStateOfResidence: String,
          primaryPhysicalAddress: String,
          utilityBillForPrimaryResidence: String,
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

    const attibuteByType = (attrs: any[], type: string) => {
      return (attrs.find(a => a.AttributeType === type) ?? { AttributeValue: "" }).AttributeValue
    }

    return {
      primaryEmail: attibuteByType(attributes, 'PrimaryEmail'),
      nameOfUser: attibuteByType(attributes, 'NameOfUser'),
      primaryPhone: attibuteByType(attributes, 'PrimaryPhone'),
      dateOfBirth: attibuteByType(attributes, 'DateOfBirth'),
      birthCertificateDocument: attibuteByType(attributes, 'BirthCertificateDocument'),
      countryOfBirth: attibuteByType(attributes, 'CountryOfBirth'),
      nationalId: attibuteByType(attributes, 'NationalId'),
      currentCountryOfResidence: attibuteByType(attributes, 'CurrentCountryOfResidence'),
      currentStateOfResidence: attibuteByType(attributes, 'CurrentStateOfResidence'),
      primaryPhysicalAddress: attibuteByType(attributes, 'PrimaryPhysicalAddress'),
      utilityBillForPrimaryResidence: attibuteByType(attributes, 'UtilityBillForPrimaryResidence'),
    };
  }
}
