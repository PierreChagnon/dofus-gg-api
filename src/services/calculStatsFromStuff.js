export default function calculStatsFromStuff(stuff, statsFromSet) {
    var itemStatRaw = [];
    var finalRes = {};

    //Pour chaque item du stuff
    Object.keys(stuff).forEach((item) => {
        const currentItem = stuff[item];
        for (let i = 0; i < currentItem.stats.length; i++) {
            const string = currentItem.stats[i];
            //On enlève d'abord les stats à parenthèse (dommages d'armes)
            //et les stats inutiles (réduction coût PA des sorts par exemple)
            const degatsTest = string.includes("dommages");
            const pvRendusTest = string.includes("rendus");
            const volTest = string.includes("vol");
            const reductionTest = string.includes("Réduit");

            if (reductionTest || degatsTest || pvRendusTest || volTest) {
                continue;
            }

            if (string.includes("à")) {
                const indexOfA = string.indexOf("à");
                const slice = string.slice(indexOfA + 2);

                //On prend les 2 valeurs car on peut etre dans le négatif
                const bothValue = string.match(/-*\d+/g);
                const value = Math.max(...bothValue);
                const key = slice.replace(/-*\d+ */, "");
                if (key === "Dommages") {
                    //Pour ajouter les dommages "simples" à tous les types
                    itemStatRaw.push({ name: "Dommages Feu", value: value });
                    itemStatRaw.push({ name: "Dommages Terre", value: value });
                    itemStatRaw.push({ name: "Dommages Air", value: value });
                    itemStatRaw.push({ name: "Dommages Eau", value: value });
                    itemStatRaw.push({ name: "Dommages Neutre", value: value });
                } else {
                    itemStatRaw.push({ name: key, value: value });
                }
            } else {
                const value = Number(string.match(/-*\d+/));
                const key = string.replace(/-*\d+ */, "");

                itemStatRaw.push({ name: key, value: value });
            }
        }
    });

    //On ajoute les stats de bonus pano ici
    Object.keys(statsFromSet).forEach((stat) => {
        const key = stat;
        const value = statsFromSet[stat];
        itemStatRaw.push({ name: key, value: value });
    });
    //console.log(itemStatRaw);

    //Ici on additionne les stats identiques
    const res = Array.from(
        itemStatRaw.reduce(
            (m, { name, value }) => m.set(name, (m.get(name) || 0) + value),
            new Map()
        ),
        ([name, value]) => ({ name, value })
    );

    //Faisons un tableau simple des caracs:
    //ex : [Vitalité : 900, PA: 7, ...]
    for (let i = 0; i < res.length; i++) {
        const stat = res[i];
        const key = stat.name;
        const value = stat.value;

        finalRes = {...finalRes, [key]: value };
    }
    //console.log(finalRes);
    return finalRes;
}

//ESSAIS POUR ECHAPPER A LA BOUCLE IF("à") ET RACCOURCIR
// const key = string.match(/\w*\s\w+$/);
// console.log("key vaut:" + key);
// const value = Number(string.match(/\s*-*\d+/));
// // const value = Number(matchValue);
// console.log("value vaut:" + value);
// return value;