const form = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const messageBox = document.getElementById("newsletter-message");

if (form && emailInput && messageBox) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    messageBox.textContent = "";
    messageBox.style.color = "";

    if (!email || !email.includes("@")) {
      messageBox.textContent = "Veuillez saisir une adresse e-mail valide.";
      messageBox.style.color = "#b91c1c";
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l’inscription.");
      }

      messageBox.textContent = data.message || "Merci pour votre inscription !";
      messageBox.style.color = "#166534";
      form.reset();
    } catch (error) {
      console.error("Newsletter error:", error);
      messageBox.textContent = error.message || "Une erreur est survenue.";
      messageBox.style.color = "#b91c1c";
    }
  });
}
