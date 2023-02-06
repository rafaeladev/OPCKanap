/**
 * Récupére les données de l'API et les affiche sur le DOM
 */

const addCanapData = () =>
    fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            //Affichage des elements dans le DOM
            //console.log (typeof data, data)
            for (let i = 0; i < data.length; i++) {
                const article = data[i];
                // Récupération de l'élément du DOM qui accueillera les itemss
                const sectionItems = document.getElementById("items");

                //Link
                const linkCanap = document.createElement("a");
                sectionItems.appendChild(linkCanap);
                linkCanap.href = `./product.html?id=${article._id}`;

                // Création d’une balise article dédiée à un canap
                const canapArticle = document.createElement("article");
                linkCanap.appendChild(canapArticle);

                //Definition du contenu d'un article
                //Image
                const canapImage = document.createElement("img");
                canapImage.src = article.imageUrl;
                canapImage.alt = article.altTxt;
                canapArticle.appendChild(canapImage);

                //Nom
                const canapName = document.createElement("h3");
                canapName.innerText = article.name;
                canapArticle.appendChild(canapName);

                //Description
                const canapDescription = document.createElement("p");
                canapDescription.textContent =
                    article.description ?? "Pas de description pour le moment.";
                canapArticle.appendChild(canapDescription);
            }
        })
        .catch((error) => {
            // Récupération de l'élément du DOM qui accueillera les itemss
            const sectionItems = document.getElementById("items");

            // Affichage de la message d'erreur
            sectionItems.textContent =
                "ERREUR : Aucun produit n'a été trouvé depuis l'API";
            alert(error);
        });

/**
 * Appelle la fonction addCanapData de façon asynchrone
 */
const main = async () => {
    await addCanapData();
};

main();
