//On récupère les données du localStorage
let articlesPanier = window.localStorage.getItem("produits");
articlesPanier = JSON.parse(articlesPanier);





async function collecteDonneesAPI () {

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
                console.log('Récupération informations pour article ID ' + articlesPanier[i].id + ' a échoué', err);
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
     const articleItem = document.createElement('article');
     articleItem.className = 'cart__item';
     articleItem.setAttribute('data-id', itemPanier.id);
     articleItem.setAttribute('data-color', itemPanier.couleur);
     sectionItems.appendChild(articleItem);
 
     //Definition du contenu d'un article
         //Image
         const divImageCanap = document.createElement('div');
         divImageCanap.className = 'cart__item__img';
         articleItem.appendChild(divImageCanap);
 
             const imageCanap = document.createElement('img');
             imageCanap.src = articleAPI.imageUrl;
             imageCanap.alt = articleAPI.altTxt;
             divImageCanap.appendChild(imageCanap);
 
         //Content
         const contentCanap = document.createElement('div');
         contentCanap.className = 'cart__item__content';
         articleItem.appendChild(contentCanap);
 
             //Nom
             const nomCanap = document.createElement('h2');
             nomCanap.textContent = articleAPI.name;
             contentCanap.appendChild(nomCanap);
 
             //Couleur
             const couleurCanap = document.createElement('p');
             couleurCanap.textContent = itemPanier.couleur;
             contentCanap.appendChild(couleurCanap);
 
             //Prix
             const prixCanap = document.createElement("p");
             prixCanap.textContent = articleAPI.price + '€';
             contentCanap.appendChild(prixCanap);
 
         //Settings
         const settingsCanap = document.createElement('div');
         settingsCanap.className = 'cart__item__content__settings';
         articleItem.appendChild(settingsCanap);
 
             //Quantité
             const quantiteCanap = document.createElement('div');
             quantiteCanap.className = 'cart__item__content__settings__quantity';
             settingsCanap.appendChild(quantiteCanap);
 
                 // Quantité text
                 const quantiteText = document.createElement('p');
                 quantiteText.textContent = "Qté : "
                 quantiteCanap.appendChild(quantiteText);
 
                 // Quantité Input
                 const quantiteInput = document.createElement('input');
                 quantiteInput.value = itemPanier.quantite;
                 quantiteInput.className = "itemQuantity";
                 quantiteInput.setAttribute("type", "number");
                 quantiteInput.setAttribute("min", "1");
                 quantiteInput.setAttribute("max", "100");
                 quantiteInput.setAttribute("name", "itemQuantity");
                 quantiteCanap.appendChild(quantiteInput);
 
 
             //Delete
             const deleteCanap = document.createElement('div');
             deleteCanap.className = 'cart__item__content__settings__delete';
             settingsCanap.appendChild(deleteCanap);
 
                 //Item supprimer
                 const bouttonSupprimer = document.createElement("p");
                 bouttonSupprimer.className = "deleteItem";
                 bouttonSupprimer.textContent = 'Supprimer';
                 deleteCanap.appendChild(bouttonSupprimer);
}


collecteDonneesAPI();

