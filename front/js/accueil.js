//Récupérer les données de l'API

const addCanapData = () => fetch("http://localhost:3000/api/products")
.then((response) => response.json())
    .then((data) => {
      //Affichage des elements dans le DOM
      //console.log (typeof data, data)
      for(let i = 0; i < data.length; i++) {
          const article = data[i];
          // Récupération de l'élément du DOM qui accueillera les itemss
          const sectionItems = document.getElementById("items");

          //Link
          const linkCanap = document.createElement("a");
          sectionItems.appendChild(linkCanap);
          linkCanap.href = `./product.html?id=${article._id}`;

          // Création d’une balise article dédiée à un canap
          const articleCanap = document.createElement("article");
          linkCanap.appendChild(articleCanap);

          //Definition du contenu d'un article
              //Image
              const imageCanap = document.createElement("img");
              imageCanap.src = article.imageUrl;
              imageCanap.alt = article.altTxt;
              articleCanap.appendChild(imageCanap);

              //Nom
              const nomCanap = document.createElement("h3");
              nomCanap.innerText = article.name;
              articleCanap.appendChild(nomCanap);

              //Description
              const descriptionCanap = document.createElement("p");
              descriptionCanap.textContent = article.description ?? "Pas de description pour le moment.";
              articleCanap.appendChild(descriptionCanap);
      }
    }
)  
    .catch ((error) => {
        // Récupération de l'élément du DOM qui accueillera les itemss
        const sectionItems = document.getElementById("items");
        sectionItems.textContent = "ERREUR : Aucun produit n'a été trouvé depuis l'API";
        alert(error);
    });    

const main = async () => {
    await addCanapData();
};

main();
