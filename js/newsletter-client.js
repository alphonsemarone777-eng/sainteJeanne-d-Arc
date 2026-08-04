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