function verifierId () {
    // Prendre les paramètres de l'URL
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('orderId')) {

        let idCommande = searchParams.get("orderId");

        const confirmationCommande = document.getElementById('orderId');
        confirmationCommande.textContent = idCommande;
    } else {
        confirmationCommande.textContent = "ERREUR : Aucun numéro de commande a été trouvé";
    }
}

verifierId();