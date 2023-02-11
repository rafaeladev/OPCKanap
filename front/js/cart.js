//On récupère les données du localStorage
var cartItems = new Array();
cartItems = window.localStorage.getItem("products");
cartItems = JSON.parse(cartItems);

/**
 * Récupère le prix d'un produit dans l'API à partir des données du LocalStorage
 */
async function datafromAPI() {
    //Encerrer la fonction s'il n'y a aps d'articles dans le panier
    if (cartItems == null) {
        return;
    }
    // Initilisation de la quantité et prix totaux
    let totalPrice = 0;
    let totalQuantity = 0;

    for (let i = 0; i < cartItems.length; i++) {
        totalQuantity += cartItems[i].quantity;

        await fetch(`http://localhost:3000/api/products/${cartItems[i].id}`)
            .then((response) => {
                return response.json();
            })
            .then((articleAPI) => {
                totalPrice =
                    totalPrice + articleAPI.price * cartItems[i].quantity;

                // Affichage de l'article dans la page
                showProductInCart(articleAPI, cartItems[i]);
            })
            .catch((err) => {
                console.log(
                    "Récupération informations pour article ID " +
                        cartItems[i].id +
                        " a échoué",
                    err
                );
            });
    }

    // Affichage sur la page de la quantité totale et du prix total
    const totalQuantityDiv = document.getElementById("totalQuantity");
    totalQuantityDiv.textContent = totalQuantity;
    const totalPriceDiv = document.getElementById("totalPrice");
    totalPriceDiv.textContent = totalPrice;
}

/**
 * Affiche les produits dans le panier
 * @param { Object } apiArticle.id
 * @param { Object } apiArticle.imageUrl
 * @param { Object } apiArticle.altTxt
 * @param { Object } apiArticle.price
 * @param { Object } localStorageArticle.id
 * @param { Object } localStorageArticle.color
 * @param { Object } localStorageArticle.quantite
 */
function showProductInCart(apiArticle, localStorageArticle) {
    // Récupération de l'élément du DOM qui accueillera les itemss
    const sectionItems = document.querySelector("#cart__items");
    //sectionItems.innerHTML = "";

    // Création d’une balise article dédiée à un canap
    const articleItem = document.createElement("article");
    articleItem.className = "cart__item";
    articleItem.setAttribute("data-id", localStorageArticle.id);
    articleItem.setAttribute("data-color", localStorageArticle.color);
    sectionItems.appendChild(articleItem);

    //Definition du contenu d'un article
    //Image
    const canapImageDiv = document.createElement("div");
    canapImageDiv.className = "cart__item__img";
    articleItem.appendChild(canapImageDiv);

    const canapImage = document.createElement("img");
    canapImage.src = apiArticle.imageUrl;
    canapImage.alt = apiArticle.altTxt;
    canapImageDiv.appendChild(canapImage);

    //Content
    const canapContent = document.createElement("div");
    canapContent.className = "cart__item__content";
    articleItem.appendChild(canapContent);

    //Nom
    const canapName = document.createElement("h2");
    canapName.textContent = apiArticle.name;
    canapContent.appendChild(canapName);

    //Couleur
    const canapColor = document.createElement("p");
    canapColor.textContent = localStorageArticle.color;
    canapContent.appendChild(canapColor);

    //Prix
    const canapPrice = document.createElement("p");
    canapPrice.textContent = apiArticle.price + "€";
    canapContent.appendChild(canapPrice);

    //Settings
    const canapSettings = document.createElement("div");
    canapSettings.className = "cart__item__content__settings";
    canapContent.appendChild(canapSettings);

    //Quantité
    const canapQuantity = document.createElement("div");
    canapQuantity.className = "cart__item__content__settings__quantity";
    canapSettings.appendChild(canapQuantity);

    // Quantité text
    const titleQuantity = document.createElement("p");
    titleQuantity.textContent = "Qté : ";
    canapQuantity.appendChild(titleQuantity);

    // Quantité Input
    const inputQuantity = document.createElement("input");
    inputQuantity.value = localStorageArticle.quantity;
    inputQuantity.className = "itemQuantity";
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("name", "itemQuantity");
    canapQuantity.appendChild(inputQuantity);

    //Delete
    const canapDelete = document.createElement("div");
    canapDelete.className = "cart__item__content__settings__delete";
    canapSettings.appendChild(canapDelete);

    //Item supprimer
    const deleteButton = document.createElement("p");
    deleteButton.className = "deleteItem";
    deleteButton.textContent = "Supprimer";
    canapDelete.appendChild(deleteButton);

    // --- Modification Panier
    let allDeleteButtons = document.getElementsByClassName("deleteItem");
    let allQuantityInputs = document.getElementsByClassName("itemQuantity");

    // On appelle les fonctions lors du clic ou changement de l'input
    for (let button of allDeleteButtons) {
        button.addEventListener("click", deleteProduct);
    }

    for (let input of allQuantityInputs) {
        input.addEventListener("change", updateProductQuantity);
    }
}

/**
 * Supprime un produit du panier à partir du click sur le boutton supprimer
 */
function deleteProduct(click) {
    let searchedProduct = click.target.closest("article");

    // On filtre le produit en fonction de son id et sa couleur dans le localStorage et puis on le suprimme
    cartItems = cartItems.filter(
        (article) =>
            article.id !== searchedProduct.dataset.id ||
            article.color !== searchedProduct.dataset.color
    );

    localStorage.setItem("products", JSON.stringify(cartItems)); //tableau d'objets

    alert("Le produit a été supprimé");
    window.location.reload();

    //collecteDonneesAPI();
}

/**
 * Modifie la quantité d'un proudit dans le panier à partir du changement d'un input
 */
function updateProductQuantity(click) {
    let searchedProduct = click.target.closest("article");
    let modifiedQuantity = click.target.closest(".itemQuantity");

    // On filtre le produit en fonction de son id et sa couleur dans le localStorage et puis on remplace sa quantité
    let foundProduct = cartItems.find(
        (article) =>
            article.id == searchedProduct.dataset.id &&
            article.color == searchedProduct.dataset.color
    );
    let updateQuantity = parseInt(modifiedQuantity.value);
    if (updateQuantity > 100 || updateQuantity < 1) {
        alert("La quantité doit être comprise entre 1 et 100");
        window.location.reload();
    } else {
        foundProduct.quantity = updateQuantity;
        localStorage.setItem("products", JSON.stringify(cartItems));
        window.location.reload();
        //collecteDonneesAPI();
    }
}

/**
 * Vérifie la validité ou conformité des textes envoyés dans le formulaire
 * @param { String } textToValidate
 * @param { String } text
 */
function checkText(textToValidate, text) {
    //Définitions de la reg exp pour les textes
    const textRegExp = new RegExp("^[A-Za-z-_ ]{3,30}$", "g");

    //On eleve les spaces du string
    const newString = textToValidate.value.trim();

    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const errorMessage = textToValidate.nextElementSibling;

    // Vérification du contenu du texte
    if (textRegExp.test(newString)) {
        errorMessage.textContent = ``;
        return true;
    } else {
        errorMessage.textContent = `Format ${text} invalide`;
        return false;
    }
}

/**
 * Vérifie la conformité en nombre de caractères max des adresses envoyés dans le formulaire
 * @param { String {..40} } adressToValidate
 * @param { String } text
 */
function checkAdress(adressToValidate, text) {
    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const errorMessage = adressToValidate.nextElementSibling;

    //On eleve les spaces du string
    const newString = adressToValidate.value.trim();

    // Vérification de la quantité de caractères du texte
    // On remplace les " " et on compte le nombre de caractères
    if (newString.length > 50 || !newString.replace(/\s/g, "").length) {
        errorMessage.textContent = `${text} est invalide`;
        return false;
    } else {
        errorMessage.textContent = ``;
        return true;
    }
}

/**
 * Vérifie la validité ou conformité des textes envoyés dans le formulaire
 * @param { String {..40} } emailToValidate
 * @param { String } text
 */
function checkEmail(emailToValidate) {
    //Définiton de la reg exp pour les emails
    const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const errorMessage = emailToValidate.nextElementSibling;
    //On eleve les spaces du string
    const newString = emailToValidate.value.trim();

    // Vérification du contenu du email
    if (emailRegExp.test(newString)) {
        errorMessage.textContent = ``;
        return true;
    } else {
        errorMessage.textContent = `Format ${emailToValidate.id} invalide`;
        return false;
    }
}

/**
 * Passe la commande et renvoi l'utilisateur vers la page de confirmation
 */
function placeOrder() {
    //Encerrer la fonction s'il n'y a aps d'articles dans le panier
    if (cartItems == null) {
        return;
    }

    //Récupération de l'élement formulaire dans le DOM
    const orderForm = document.querySelector(".cart__order__form");

    //------- DEBUT : Gestion de la validité du contenu du formulaire -------//

    //----Contrôle du prénom
    //Récuperation du imput Prénom
    const firstName = orderForm.firstName;
    firstName.addEventListener("change", function () {
        //Appel de la fonction de validation
        checkText(this, "du Prénom");
    });

    //----Contrôle du nom
    //Récuperation du imput Nom
    const lastName = orderForm.lastName;

    lastName.addEventListener("change", function () {
        //Appel de la fonction de validation
        checkText(this, "du Nom");
    });

    //----Contrôle de l'adresse'
    //Récuperation du imput Ville
    const adress = orderForm.address;

    adress.addEventListener("change", function () {
        //Appel de la fonction de validation
        checkAdress(this, "L'adresse");
    });

    //----Contrôle de la Ville
    //Récuperation du imput Ville
    const city = orderForm.city;

    city.addEventListener("change", function () {
        //Appel de la fonction de validation
        checkText(this, "de la Ville");
    });

    //----Contrôle du email
    //Récuperation du imput Email
    const email = orderForm.email;

    email.addEventListener("change", function () {
        //Appel de la fonction de validation
        checkEmail(this, "du Mail");
    });

    //------- FIN : Gestion de la validité du contenu du formulaire -------//

    //Evenemment lorsqu'on clique sur le boutton commander
    orderForm.order.addEventListener("click", (click) => {
        click.preventDefault();

        const orderId = [];
        for (let product of cartItems) {
            orderId.push(product.id);
        }
        //console.log(orderId);

        // Création du objet avec els infos pour la commande
        const newOrder = {
            contact: {
                firstName: orderForm.firstName.value,
                lastName: orderForm.lastName.value,
                address: orderForm.address.value,
                city: orderForm.city.value,
                email: orderForm.email.value,
            },
            products: orderId,
        };

        //Gestion de la validation du formulaire
        if (
            checkText(firstName) &&
            checkText(lastName) &&
            checkText(city) &&
            checkEmail(email) &&
            newOrder.products.length > 0
        ) {
            // La definition du corps pour la méthode Fetch Post pour le stockage de la commande
            let fetchBody = {
                method: "POST",
                body: JSON.stringify(newOrder),
                headers: {
                    "Content-Type": "application/json",
                },
            };

            fetch("http://localhost:3000/api/products/order", fetchBody)
                .then((response) => {
                    return response.json();
                })
                .then((toOrder) => {
                    //console.log(toOrder.orderId);
                    window.localStorage.clear("products");
                    document.location.href = `./confirmation.html?orderId=${toOrder.orderId}`;
                })
                .catch((error) => {
                    alert(
                        "Des soucis ont eté rencontrés pour connecter à l'API",
                        error
                    );
                });
        } else {
            alert("Le formulaire est incorrect");
        }
    });
}

datafromAPI();
placeOrder();
