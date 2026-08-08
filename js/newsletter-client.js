const form = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const messageBox = document.getElementById("newsletter-message");

if (form && emailInput && messageBox) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    messageBox.textContent = "Inscription en cours...";
    messageBox.style.color = "";

    if (!email || !email.includes("@")) {
      messageBox.textContent = "Veuillez saisir une adresse e-mail valide.";
      messageBox.style.color = "#b91c1c";
      return;
    }

    console.log("Newsletter submit", { email });

    try {
      const response = await fetch("/.netlify/functions/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Newsletter response", { status: response.status, data });

      if (!response.ok) {
        const errorMessage =
          typeof data.message === "string"
            ? data.message
            : typeof data === "string"
              ? data
              : JSON.stringify(data);
throw new Error( `Erreur ${response.status}: ${errorMessage || "Erreur lors de l’inscription."}`); 
      }

      messageBox.textContent =
        typeof data.message === "string"
          ? data.message
          : "Merci pour votre inscription !";
      messageBox.style.color = "#166534";
      form.reset();
    } catch (error) {
      console.error("Newsletter error:", error);
      messageBox.textContent = error.message || "Une erreur est survenue.";
      messageBox.style.color = "#b91c1c";
    }
  });
}
