//On récupère les données du localStorage
var articlesPanier = new Array();
articlesPanier = window.localStorage.getItem("produits");
articlesPanier = JSON.parse(articlesPanier);





async function collecteDonneesAPI () {
    //Encerrer la fonction s'il n'y a aps d'articles dans le panier
    if (articlesPanier == null) {
        return;
    }
    // Initilisation de la quantité et prix total
    let prixTotal = 0;
    let quantiteTotale = 0;


    for (let i = 0 ; i < articlesPanier.length ; i++) {
        quantiteTotale += articlesPanier[i].quantite;
        
        await fetch(`http://localhost:3000/api/products/${articlesPanier[i].id}`)
            .then((response) => {
                return response.json();
            })
            .then((articleAPI) => {
                prixTotal = prixTotal + (articleAPI.price * articlesPanier[i].quantite);

                // Affichage de l'article dans la page
                afficherArticle(articleAPI,articlesPanier[i]);
            })
            .catch((err) => {
                console.log("Récupération informations pour article ID " + articlesPanier[i].id + " a échoué", err);
            });
    }

    // Affichage sur la page de la quantité totale et du prix total
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.textContent = quantiteTotale;
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent= prixTotal;
}




function afficherArticle (articleAPI,itemPanier){
     // Récupération de l'élément du DOM qui accueillera les itemss
     const sectionItems = document.querySelector("#cart__items");

     // Création d’une balise article dédiée à un canap
     const articleItem = document.createElement("article");
     articleItem.className = "cart__item";
     articleItem.setAttribute("data-id", itemPanier.id);
     articleItem.setAttribute("data-color", itemPanier.couleur);
     sectionItems.appendChild(articleItem);
 
     //Definition du contenu d'un article
         //Image
         const divImageCanap = document.createElement("div");
         divImageCanap.className = "cart__item__img";
         articleItem.appendChild(divImageCanap);
 
             const imageCanap = document.createElement("img");
             imageCanap.src = articleAPI.imageUrl;
             imageCanap.alt = articleAPI.altTxt;
             divImageCanap.appendChild(imageCanap);
 
         //Content
         const contentCanap = document.createElement("div");
         contentCanap.className = "cart__item__content";
         articleItem.appendChild(contentCanap);
 
             //Nom
             const nomCanap = document.createElement("h2");
             nomCanap.textContent = articleAPI.name;
             contentCanap.appendChild(nomCanap);
 
             //Couleur
             const couleurCanap = document.createElement("p");
             couleurCanap.textContent = itemPanier.couleur;
             contentCanap.appendChild(couleurCanap);
 
             //Prix
             const prixCanap = document.createElement("p");
             prixCanap.textContent = articleAPI.price + "€";
             contentCanap.appendChild(prixCanap);
 
         //Settings
         const settingsCanap = document.createElement("div");
         settingsCanap.className = "cart__item__content__settings";
         articleItem.appendChild(settingsCanap);
 
             //Quantité
             const quantiteCanap = document.createElement("div");
             quantiteCanap.className = "cart__item__content__settings__quantity";
             settingsCanap.appendChild(quantiteCanap);
 
                 // Quantité text
                 const quantiteText = document.createElement("p");
                 quantiteText.textContent = "Qté : ";
                 quantiteCanap.appendChild(quantiteText);
 
                 // Quantité Input
                 const quantiteInput = document.createElement("input");
                 quantiteInput.value = itemPanier.quantite;
                 quantiteInput.className = "itemQuantity";
                 quantiteInput.setAttribute("type", "number");
                 quantiteInput.setAttribute("min", "1");
                 quantiteInput.setAttribute("max", "100");
                 quantiteInput.setAttribute("name", "itemQuantity");
                 quantiteCanap.appendChild(quantiteInput);
 
 
             //Delete
             const deleteCanap = document.createElement("div");
             deleteCanap.className = "cart__item__content__settings__delete";
             settingsCanap.appendChild(deleteCanap);
 
                 //Item supprimer
                 const bouttonSupprimer = document.createElement("p");
                 bouttonSupprimer.className = "deleteItem";
                 bouttonSupprimer.textContent = "Supprimer";
                 deleteCanap.appendChild(bouttonSupprimer);

    
    // --- Modification Panier
    let bouttonsSupprimer = document.getElementsByClassName("deleteItem");
    let quantiteInputs = document.getElementsByClassName("itemQuantity");
             

    // On appelle les fonctions lors du clic ou changement de l'input
    for (let button of bouttonsSupprimer) {
        button.addEventListener("click", supprimerProduit);
    }

    for (let input of quantiteInputs) {
        input.addEventListener("change", changerQuantiteProduit);
    }
    
}

// Fonction pour supprimer un produit du panier
function supprimerProduit(click) {
    let produitCible = click.target.closest("article");
    console.log(articlesPanier);
    
    // On filtre le produit en fonction de son id et sa couleur dans le localStorage et puis on le suprimme
    articlesPanier = articlesPanier.filter(article => article.id !== produitCible.dataset.id || article.couleur !== produitCible.dataset.color);
    console.log(typeof articlesPanier, articlesPanier);
    localStorage.setItem("produits", JSON.stringify(articlesPanier)); //tableau d'objets

    alert("Le produit a été supprimé");
    window.location.reload();
}

// Fonction pour modifier la quantité d'un produit dans le panier
function changerQuantiteProduit(click) {
    let produitCible = click.target.closest("article");
    let quantiteModifie = click.target.closest(".itemQuantity");

    // On filtre le produit en fonction de son id et sa couleur dans le localStorage et puis on remplace sa quantité
    let produitTrouve = articlesPanier.find(article => article.id == produitCible.dataset.id && article.couleur == produitCible.dataset.color);
    let nouvelleQuantite = parseInt(quantiteModifie.value);
    produitTrouve.quantite = nouvelleQuantite;
    localStorage.setItem("produits", JSON.stringify(articlesPanier));
    window.location.reload();
}

// Fonction pour vérifier la validité des textes envoyé dans le formulaire
function validerTexte(textToValidate, text) {

    //Définitions de la reg exp pour les textes
    const texteRegExp = new RegExp("^[A-Za-z-_ ]{3,30}$", "g");

    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const messageErreur = textToValidate.nextElementSibling;

    // Vérification du contenu du texte
    if(texteRegExp.test(textToValidate.value)) {
        messageErreur.textContent = "";
        return true;
        
    }else{
        messageErreur.textContent = `Format ${text} pas valide`;
        return false;
    }
}

// Fonction pour vérifier la validité de l'adresse envoyée dans le formulaire
function validerAdresse(textToValidate, text) {

    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const messageErreur = textToValidate.nextElementSibling;

    // Vérification de la quantité de caractères du texte
    if(textToValidate.value.length < 40) {
        messageErreur.textContent = "";
        return true;
        
    }else{
        messageErreur.textContent = `${text} est trop longue (plus de 40 caractères)`;
        return false;
    }
}

// Fonction pour vérifier la validité du email envoyé dans le formulaire
function validerEmail(emailToValidate) {

    //Définiton de la reg exp pour les emails
    const emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
    
    //Récupération de l'élement du DOM pour contenir le message d'erreur
    const messageErreur = emailToValidate.nextElementSibling;

    // Vérification du contenu du email
    if(emailRegExp.test(emailToValidate.value)) {
        messageErreur.textContent = "";
        return true;
        
    }else{
        messageErreur.textContent = `Format ${emailToValidate.id} pas valide`;
        return false;
    }
}

function passerCommande (){

    //Encerrer la fonction s'il n'y a aps d'articles dans le panier
    if (articlesPanier == null) {
        return;
    }

    //Récupération de l'élement formulaire dans le DOM
    const formCommande = document.querySelector(".cart__order__form");
    
    //------- DEBUT : Gestion de la validité du contenu du formulaire -------//

    //----Contrôle du prénom
    //Récuperation du imput Prénom
    const lePrenom = formCommande.firstName;
    lePrenom.addEventListener("change", function() {
        //Appel de la fonction de validation
        validerTexte(this, "du Prénom");

    });

    //----Contrôle du nom
    //Récuperation du imput Nom
    const leNom = formCommande.lastName;

    leNom.addEventListener("change", function() {
        //Appel de la fonction de validation
        validerTexte(this, "du Nom");
    });

    //----Contrôle de l'adresse'
    //Récuperation du imput Ville
    const lAdresse = formCommande.address;

    lAdresse.addEventListener("change", function() {
        //Appel de la fonction de validation
        validerAdresse(this, "L'adresse");
    });

    //----Contrôle de la Ville
    //Récuperation du imput Ville
    const laVille = formCommande.city;

    laVille.addEventListener("change", function() {
        //Appel de la fonction de validation
        validerTexte(this, "de la Ville");
    });

    //----Contrôle du email
    //Récuperation du imput Email
    const leMail = formCommande.email;

    leMail.addEventListener("change", function() {
        //Appel de la fonction de validation
        validerEmail(this, "du Mail");
    });
    
    //------- FIN : Gestion de la validité du contenu du formulaire -------//


    //Evenemment lorsqu'on clique sur le boutton commander
    formCommande.order.addEventListener("click", (click) => {
        click.preventDefault();

        const orderId = [];
        for (let produit of articlesPanier) {
            orderId.push(produit.id);
        }
        console.log (orderId);

        // Création du objet avec els infos pour la commande
        const nouvelleCommande = {
            contact: {
                firstName: formCommande.firstName.value,
                lastName: formCommande.lastName.value,
                address: formCommande.address.value,
                city: formCommande.city.value,
                email: formCommande.email.value
            },
            products: orderId
        };

        //Gestion de la validation du formulaire
        if(validerTexte(lePrenom) && validerTexte(leNom) &&
        validerTexte(laVille) && validerEmail(leMail) && (nouvelleCommande.products.length > 0))
        {
            // La definition du corps pour la méthode Fetch Post pour le stockage de la commande
            let optionsFetch = {
                method: "POST",
                body: JSON.stringify(nouvelleCommande),
                headers: {
                    "Content-Type": "application/json"
                }
            };

            fetch("http://localhost:3000/api/products/order", optionsFetch)
                .then((response) => {
                    return response.json();
                })
                .then ((commander) => {
                    console.log(commander.orderId);
                        window.localStorage.clear ("produits");
                        document.location.href = `./confirmation.html?orderId=${commander.orderId}`;
                })
                .catch ((error) => {
                    alert("Des soucis ont eté rencontrés pour connecter à l'API", error);
                }) ; 

        }else{
            alert("Le formulaire est incorrect");
        }
    });

}


collecteDonneesAPI();
passerCommande();

