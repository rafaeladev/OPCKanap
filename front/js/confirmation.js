function verifierId() {
    // Prendre les paramètres de l'URL
    let searchParams = new URLSearchParams(window.location.search);
    let idCommande = searchParams.get("orderId");
    var confirmationCommande = document.getElementById("orderId");

    if (idCommande == "" || idCommande.length > 36) {
        confirmationCommande.textContent =
            "ERREUR : Aucun numéro de commande a été trouvé";
    } else {
        confirmationCommande.textContent = idCommande;
    }
}
verifierId();
