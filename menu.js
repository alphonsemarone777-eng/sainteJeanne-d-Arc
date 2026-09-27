/* =========================================================
   SITE MENU — MENU GLOBAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".site-header");
    const nav = document.querySelector(".main-nav");

    if (!header || !nav) {
        console.warn("Menu du site : .site-header ou .main-nav introuvable.");
        return;
    }


    /* =====================================================
       1. LE HEADER N'EST PLUS FIXE
       ===================================================== */

    header.style.position = "relative";
    header.style.top = "auto";
    header.style.bottom = "auto";


    /* =====================================================
       2. CRÉATION DU BOUTON MENU
       ===================================================== */

    const menuButton = document.createElement("button");

    menuButton.className = "site-menu-button";
    menuButton.type = "button";

    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.innerHTML = `
        <span class="site-menu-icon">☰</span>
        <span class="site-menu-text">Menu</span>
    `;


    /* =====================================================
       3. CRÉATION DU PANNEAU
       ===================================================== */

    const menuPanel = document.createElement("div");

    menuPanel.className = "site-menu-panel";
    menuPanel.setAttribute("role", "navigation");


    /* =====================================================
       4. ON PLACE LE PANNEAU DANS LE BODY
       
       IMPORTANT :
       Il n'est PAS placé dans le header.
       Il est donc indépendant de la position de la page.
       ===================================================== */

    document.body.appendChild(menuPanel);


    /* =====================================================
       5. ON DÉPLACE LA NAVIGATION DANS LE PANNEAU
       ===================================================== */

    menuPanel.appendChild(nav);


    /* =====================================================
       6. ON FORCE LA NAVIGATION À ÊTRE CACHÉE
       AU DÉPART
       ===================================================== */

    nav.style.position = "static";
    nav.style.top = "auto";
    nav.style.left = "auto";
    nav.style.right = "auto";
    nav.style.bottom = "auto";

    nav.style.width = "100%";
    nav.style.maxWidth = "100%";

    nav.style.height = "auto";

    nav.style.overflow = "visible";

    /*
     * TRÈS IMPORTANT :
     * l'ancien CSS ne pourra plus laisser la nav
     * visible en dehors du panneau.
     */
    nav.style.display = "none";


    /* =====================================================
       7. LE BOUTON EST AJOUTÉ AU BODY
       ===================================================== */

    document.body.appendChild(menuButton);


    /* =====================================================
       8. ÉTAT DU MENU
       ===================================================== */

    let menuOuvert = false;


    /* =====================================================
       9. OUVRIR / FERMER
       ===================================================== */

    function ouvrirMenu() {

        menuOuvert = true;

        menuPanel.classList.add("is-open");
        menuButton.classList.add("is-open");

        nav.style.display = "block";

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Fermer le menu");

        menuButton.querySelector(".site-menu-icon").textContent = "✕";
    }


    function fermerMenu() {

        menuOuvert = false;

        menuPanel.classList.remove("is-open");
        menuButton.classList.remove("is-open");

        nav.style.display = "none";

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");

        menuButton.querySelector(".site-menu-icon").textContent = "☰";
    }


    function toggleMenu() {

        if (menuOuvert) {
            fermerMenu();
        } else {
            ouvrirMenu();
        }

    }


    /* =====================================================
       10. CLIC SUR LE BOUTON
       ===================================================== */

    menuButton.addEventListener("click", function (event) {

        event.stopPropagation();

        toggleMenu();

    });


    /* =====================================================
       11. CLIC SUR UN LIEN
       ===================================================== */

    nav.addEventListener("click", function (event) {

        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        fermerMenu();

    });


    /* =====================================================
       12. ÉCHAP
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && menuOuvert) {
            fermerMenu();
        }

    });


    /* =====================================================
       13. CLIC EN DEHORS DU MENU
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (!menuOuvert) {
            return;
        }

        if (
            !menuPanel.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            fermerMenu();
        }

    });

});