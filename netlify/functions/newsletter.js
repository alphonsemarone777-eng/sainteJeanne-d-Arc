// import * as SibApiV3Sdk from "@getbrevo/brevo";

// export const handler = async (event) => {
//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ message: "Méthode non autorisée" }),
//     };
//   }

//   let payload = {};

//   try {
//     payload = event.body ? JSON.parse(event.body) : {};
//   } catch (error) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: "Corps de requête invalide" }),
//     };
//   }

//   const email = payload.email?.trim();

//   if (!email) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: "Email manquant" }),
//     };
//   }

//   if (!email.includes("@")) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: "Email invalide" }),
//     };
//   }

//   if (!process.env.BREVO_API_KEY) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Configuration Brevo manquante" }),
//     };
//   }

//   try {
//     const apiInstance = new SibApiV3Sdk.ContactsApi();

//     apiInstance.setApiKey(
//       SibApiV3Sdk.ContactsApiApiKeys.apiKey,
//       process.env.BREVO_API_KEY,
//     );

//     const createContact = new SibApiV3Sdk.CreateContact();
//     createContact.email = email;

//     // if (process.env.BREVO_LIST_ID) {
//     //   createContact.listIds = [Number(process.env.BREVO_LIST_ID)];
//     // }
//        createContact.listIds = [3];
//     await apiInstance.createContact(createContact);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Inscription réussie" }),
//     };
// //   } catch (error) {
// //     console.error("Brevo newsletter error:", error);

// //     return {
// //       statusCode: 500,
// //       body: JSON.stringify({ message: "Erreur lors de l’inscription" }),
// //     };
// //   }
// } catch (error) {
//   console.error("Brevo newsletter error:");
//   console.error(error.response?.body || error);

//   return {
//     statusCode: 500,
//     body: JSON.stringify({
//       message: error.response?.body || error.message,
//     }),
//   };
// }
// };
const form = document.getElementById("newsletter-form");
const message = document.getElementById("newsletter-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Inscription en cours...";

  const email = document.getElementById("email").value.trim();

  try {
    const response = await fetch("/.netlify/functions/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = data.message;
      form.reset();
    } else {
      // Affiche correctement les erreurs venant de Brevo
      if (typeof data.message === "object") {
        message.textContent = JSON.stringify(data.message);
      } else {
        message.textContent = data.message || "Une erreur est survenue";
      }
    }

  } catch (error) {
    console.error("Erreur newsletter :", error);
    message.textContent = "Impossible de contacter le serveur.";
  }
});