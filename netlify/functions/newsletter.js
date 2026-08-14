import {
  ContactsApi,
  ContactsApiApiKeys,
  CreateContact,
} from "@getbrevo/brevo";

export async function handler(event) {
  console.log("Newsletter function called", { method: event.httpMethod });

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
    console.error("Newsletter parse error", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Corps de requête invalide" }),
    };
  }

  const email = payload.email?.trim();

  if (!email || !email.includes("@")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email invalide" }),
    };
  }

  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY missing");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Configuration Brevo manquante" }),
    };
  }

  try {
    const apiInstance = new ContactsApi();
    apiInstance.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const createContact = new CreateContact();
    createContact.email = email;
    createContact.updateEnabled = true;
    if (process.env.BREVO_LIST_ID) {
      createContact.listIds = [Number(process.env.BREVO_LIST_ID)];
    }

    await apiInstance.createContact(createContact);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Inscription réussie" }),
    };
  } catch (error) {
    const brevoMessage =
      error?.response?.body?.message ||
      error?.response?.body?.code ||
      error?.message ||
      "Erreur lors de l’inscription";

    console.error("Brevo newsletter error", error?.response?.body || error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: brevoMessage,
      }),
    };
  }
}