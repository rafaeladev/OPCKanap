// Prendre les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchId = searchParams.get("id");

/**
 * Récupère dans l'API les données d'un canapé à partir d'un ID donnée
 */
function productDetails() {
    fetch(`http://localhost:3000/api/products/${searchId}`)
        .then((response) => response.json())
        .then((article) => {
            //-------Affichage des elements du produit dans le DOM

            //Titre de la page
            document.title = `Produit : ${article.name}`;

            //Definition du contenu d'un article
            //Image
            const productImage = document.createElement("img");
            productImage.src = article.imageUrl;
            productImage.alt = article.altTxt;
            document.querySelector(".item__img").appendChild(productImage);

            //Nom et price
            const productName = document.getElementById("title");
            const productPrice = document.getElementById("price");

            productName.textContent = article.name;
            productPrice.textContent = article.price;

            //Description
            const productDescription = document.getElementById("description");
            productDescription.textContent = article.description;

            //Couleurs
            const productColors = document.getElementById("colors");
            for (let i = 0; i < article.colors.length; i++) {
                let productColorsOption = document.createElement("option");
                productColorsOption.textContent = article.colors[i];
                productColorsOption.value = article.colors[i];
                productColors.appendChild(productColorsOption);
            }
        })
        .catch((error) => {
            // Récupération de l'élément du DOM qui accueillera les itemss
            let sectionItem = document.querySelector(".item");

            // Affichage de la message d'erreur
            sectionItem.textContent = "Pas de produit trouvé";
            console.log("error:" + error);
        });
}

/**
 * Récupère les données d'un produit -ID, quantité et couleur- et l'ajoute au LocalStorage
 */
function addToCart() {
    //Selection du boutton dans le DOM
    let addToCartButton = document.querySelector("#addToCart");
    //Execution de l'action au clique de la souris
    addToCartButton.addEventListener("click", function () {
        //window.localStorage.clear("produits");
        var localStorageProducts = new Array();
        localStorageProducts = JSON.parse(localStorage.getItem("products"));
        console.log(typeof localStorageProducts, localStorageProducts);

        //Création de l'objet produit à ajouter au panier
        const addProductToCart = {
            id: searchId,
            quantity: parseInt(document.querySelector("#quantity").value),
            color: document.querySelector("#colors").value,
        };

        //Vérification des conditions pour ajout au panier
        if (addProductToCart.color == "") {
            alert("Vous devez choisir une couleur");
            return;
        }
        if (addProductToCart.quantity <= 0 || addProductToCart.quantity > 100) {
            alert("Vous devez une quantité comprise entre 1 et 100!");
            return;
        }

        //Vérification du tableau localStorage
        if (localStorageProducts !== null) {
            for (let i = 0; i < localStorageProducts.length; i++) {
                if (
                    localStorageProducts[i].id === searchId &&
                    localStorageProducts[i].color === addProductToCart.color
                ) {
                    localStorageProducts[i].quantity += parseInt(
                        addProductToCart.quantity
                    );
                    if (localStorageProducts[i].quantity > 100) {
                        alert("Limite maximale de 100 unités dépassée");
                        return;
                    }
                    localStorageProducts = JSON.stringify(localStorageProducts);
                    localStorage.setItem("products", localStorageProducts);
                    alert("Produit ajouté au Panier");
                    return;
                }
            }
            localStorageProducts.push(addProductToCart);
        } else {
            var localStorageProducts = new Array();
            localStorageProducts.push(addProductToCart);
            console.log(typeof localStorageProducts, localStorageProducts);
        }

        localStorageProducts = JSON.stringify(localStorageProducts);
        localStorage.setItem("products", localStorageProducts);
        alert("Produit ajouté au Panier");
    });
}

productDetails();
addToCart();
