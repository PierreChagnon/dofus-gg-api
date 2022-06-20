//fonction de filtrage level et stat
export default function listFiltered(data, filter, level, listSize, inputValue) {

    //On vérifie d'abord si il y a le filtre de nom.
    //Dans ce cas on renvois tous les items pour que le filtre puisse passer sur chaques items.
    //Exemple: si on veut chercher le gelano alors qu'on n'a que les items de lvl 200-150, il n'apparaitrai pas
    if (inputValue) {
        return data
    }

    //Sinon on procède normalement
    //On filtre le level et on push "listeSize" fois dans un array
    var displayList = [];
    var allItems = [];
    data.forEach((item) => {
        //On constuit la displayList
        if (item.level <= level && displayList.length <= listSize) {
            displayList.push(item);
        }
        //Puis on construit la liste entière pour les filtres (nom et stat)
        if (item.level <= level) {
            allItems.push(item)
        }
    });
    //Si il y a un filtre de stat
    if (filter !== 0) {
        //On filtre alors allItems avec le filtre
        const statFilter = allItems.filter((item) => {
            var statFound = false; //Variable pour signaler la présence de la stat filtrée
            //pour chaque stat de l'item on check si il y a le filtre
            for (let j = 0; j < item.stats.length; j++) {
                const string = item.stats[j];
                //Si il est trouvé on met à jour la variable
                if (string.indexOf(filter) !== -1) {
                    statFound = true;
                }
            }
            //Puis on retourne le booléen en fonction de la var
            if (statFound === true) {
                return true;
            } else {
                return false;
            }
        });
        //Enfin on retoune la liste filtrée
        displayList = statFilter
    }
    return displayList
}