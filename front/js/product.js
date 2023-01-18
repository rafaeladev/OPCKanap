// Prendre les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("id");

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
                const nomProduct = document.querySelector("#title");
                const priceProduct = document.querySelector("#price");

                nomProduct.textContent = article.name;
                priceProduct.textContent = article.price;

                //Description
                const descriptionProduct = document.querySelector("#description");
                descriptionProduct.textContent = article.description;

                //Couleurs
                const colorsProduct = document.querySelector("#colors");
                for (let i = 0; i < article.colors.length; i++) {
                    let colorsProductOption = document.createElement("option");
                    colorsProductOption.textContent = article.colors[i];
                    colorsProductOption.value = article.colors[i];
                    colorsProduct.appendChild(colorsProductOption);
                }
            }
    )