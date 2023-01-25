//Récupération des canapés eventuellement stockés dans le localStorage
let canaps = window.localStorage.getItem('canaps');
    canaps = JSON.parse(canaps);