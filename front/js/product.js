// Prendre les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchId = searchParams.get("id");

// Faire une request à l'API du canapé avec l'ID souhaité
function produitDetails () 
{
    fetch(`http://localhost:3000/api/products/${searchId}`)
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
        .catch (err => console.log("Oh no",err))  
}

// ------- Ajouter le canapé au panier -------

function ajoutPanier () {
    //Selection du boutton dans le DOM
    let ajoutPanier = document.querySelector("#addToCart");

    //Execution de l'action au clique de la souris
    ajoutPanier.addEventListener("click", function () {

        //Création de l'objet produit à ajouter au panier
        let ajoutProduitPanier = {
            id : searchId,
            quantite : parseInt(document.querySelector("#quantity").value),
            couleur : document.querySelector("#colors").value
        }

        //Vérification des conditions pour ajout au panier
        if (ajoutProduitPanier.couleur == "") {
            alert ('Vous devez choisir une couleur')
            return ;

        } 
        if (ajoutProduitPanier.quantite <= 0 || ajoutProduitPanier.quantite > 100) {
            alert ('Vous devez une quantité comprise entre 1 et 100!')
            return;
            
        }
    
        //Cration de l'array (tableau) pour les produits du panier
        //let produitsPanier = [];

        //On récupère les données du localStorage
        //window.localStorage.clear ("produits");
        let produitsLocal = window.localStorage.getItem("produits");

        //Verifier s'il y a dejà le même produit avec la même couleur et le même ID
        if (produitsLocal !== null) {
            produitsLocal = JSON.parse(produitsLocal);
            for (i = 0 ; i < produitsLocal.length; i++){
                if (produitsLocal[i].id === searchId && produitsLocal[i].couleur === ajoutProduitPanier.couleur) {
                    produitsLocal[i].quantite += parseInt(ajoutProduitPanier.quantite);
                    produitAjoute = JSON.stringify(produitsLocal[i])
                    localStorage.setItem("produits", produitAjoute);
                }
            }
            produitsLocal.push(ajoutProduitPanier);
            produitsLocal = JSON.stringify(produitsLocal);
            localStorage.setItem("produits", produitsLocal);

            console.log("=======")
            console.log(produitsLocal)
            console.log("=======")
        } else {
            produitsLocal.push(ajoutProduitPanier);
            produitsLocal = JSON.stringify(produitsLocal);
            localStorage.setItem("produits", produitsPanier);

            console.log("+++++++")
            console.log(window.localStorage.getItem("produits"))
            console.log("+++++++")
        }
        alert ('Produit ajouté au Panier')
    });
}

function main () {
    ajoutPanier();
}

produitDetails();
main();