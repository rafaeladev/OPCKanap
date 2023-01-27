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
        .catch ((error) => {
            let sectionItem = document.querySelector(".item");
            sectionItem.textContent = "Pas de produit trouvé";
        })  
}

// ------- Ajouter le canapé au panier -------

function ajoutPanier (produitsLocal) {

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

        let produitsPanier = [];

        //Verifier s'il y a dejà le même produit avec la même couleur et le même ID
        if (produitsLocal !== null ) {
            produitsLocal = JSON.parse(produitsLocal);
            for (i = 0 ; i < produitsLocal.length; i++){
                if (produitsLocal[i].id === searchId && produitsLocal[i].couleur === ajoutProduitPanier.couleur) {
                    produitsLocal[i].quantite += parseInt(ajoutProduitPanier.quantite);
                    return produitsLocal
                } 
            }
            produitsLocal.push(ajoutProduitPanier);
            return produitsLocal

        } else {
            let produitsLocal = [];
            produitsLocal.push(ajoutProduitPanier);
            return produitsLocal;
        }
}

function main () {
    //Selection du boutton dans le DOM
    let bouttonAjoutPanier = document.querySelector("#addToCart");
    //Execution de l'action au clique de la souris
    bouttonAjoutPanier.addEventListener("click", function () {
        //On récupère les données du localStorage
        //window.localStorage.clear ("produits");
        let produitsLocal = localStorage.getItem("produits");

       let tableauProduits = ajoutPanier(produitsLocal);

        tableauProduits = JSON.stringify(tableauProduits)
        localStorage.setItem("produits", tableauProduits);
        alert ('Produit ajouté au Panier')
    });

}

produitDetails();
main();