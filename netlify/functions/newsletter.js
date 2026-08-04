import * as SibApiV3Sdk from "@getbrevo/brevo";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Méthode non autorisée" }),
    };
  }

  let payload = {};

  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Corps de requête invalide" }),
    };
  }

  const email = payload.email?.trim();

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email manquant" }),
    };
  }

  if (!email.includes("@")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email invalide" }),
    };
  }

  if (!process.env.BREVO_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Configuration Brevo manquante" }),
    };
  }

  try {
    const apiInstance = new SibApiV3Sdk.ContactsApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.ContactsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;

    // if (process.env.BREVO_LIST_ID) {
    //   createContact.listIds = [Number(process.env.BREVO_LIST_ID)];
    // }
       createContact.listIds = [3];
    await apiInstance.createContact(createContact);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Inscription réussie" }),
    };
  } catch (error) {
    console.error("Brevo newsletter error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur lors de l’inscription" }),
    };
  }
};
