// Prendre les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("id");

// Faire une request à l'API du canapé avec l'ID souhaité
fetch(`http://localhost:3000/api/products/${searchID}`)
    .then((response) => response.json())
    .then((article) => {
        //Affichage des elements du produit dans le DOM

            //Titre de la page
            document.title = `Produit : ${article.name}`;

            //Definition du contenu d'un article
                //Image
                const imageProduct = document.createElement("img");
                imageProduct.src = article.imageUrl;
                imageProduct.alt = article.altTxt;
                document.querySelector(".item__img").appendChild(imageProduct);

                //Nom et price
                const nomProduct = document.getElementById("title");
                const priceProduct = document.getElementById("price");

                nomProduct.textContent = article.name;
                priceProduct.textContent = article.price;

                //Description
                const descriptionProduct = document.getElementById("description");
                descriptionProduct.textContent = article.description;

                //Couleurs
                const colorsProduct = document.getElementById("colors");
                for (let i = 0; i < article.colors.length; i++) {
                    let colorsProductOption = document.createElement("option");
                    colorsProductOption.textContent = article.colors[i];
                    colorsProductOption.value = article.colors[i];
                    colorsProduct.appendChild(colorsProductOption);
                }
            }
    )

// ------- Ajouter le canapé au panier -------

//Selection du boutton dans le DOM
let ajoutPanier = document.querySelector("#addToCart");

//Execution de l'action au clique de la souris
ajoutPanier.addEventListener("click", function () {

    //Création de l'objet produit à ajouter au panier
    let ajoutProduitPanier = {
        id : searchID,
        quantite : parseInt(document.querySelector("#quantity").value),
        couleur : document.querySelector("#colors").value
    }

    //Vérification des conditions pour ajout au panier
    if (ajoutProduitPanier.couleur == "") {
        alert("Vous devez choisir une couleur!")

    } 
    if (ajoutProduitPanier.quantite <= 0 || ajoutProduitPanier.quantite > 100) {
        alert('Vous devez une quantité comprise entre 1 et 100!')
    }
  
    //Cration de l'array (tableau) pour les produits du panier
     let produitsPanier = [];

    //On récupère les données du localStorage
    let produitsLocal = window.localStorage.getItem("produits");

    //Verifier s'il y a dejà le même produit avec la même couleur et le même ID => corriger 
    if (produitsLocal === null) {
        produitsPanier.push(ajoutProduitPanier);
        produitsPanier = JSON.stringify(produitsPanier);
        localStorage.setItem("produits", produitsPanier);

    } else {
        produitsLocal = JSON.parse(produitsLocal);
        for (i = 0 ; i < produitsLocal.length; i++){
            if (produitsLocal[i].id === searchID && produitsLocal[i].couleur === ajoutPanier.couleur) {
                produitsLocal[i].quantite += parseInt(ajoutPanier.quantite);
                produitsLocal.setItem("produits", JSON.stringify(produitsLocal[i]));
            }
        }
        produitsPanier.push(ajoutProduitPanier);
        localStorage.setItem("produits", JSON.stringify(produitsPanier));
    }
    alert('Produit ajouté au panier!');
});