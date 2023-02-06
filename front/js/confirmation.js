/**
 * Vérifie la pressence d'un ID dans l'URL de la commande et valide la commande
 */
function checkOrderId() {
    // Prendre les paramètres de l'URL
    let searchParams = new URLSearchParams(window.location.search);
    let orderId = searchParams.get("orderId");
    var orderConfirmation = document.getElementById("orderId");

    if (orderId == "" || orderId.length > 36) {
        orderConfirmation.textContent =
            "ERREUR : Aucun numéro de commande a été trouvé";
    } else {
        orderConfirmation.textContent = orderId;
    }
}
checkOrderId();
