//Permet d'isoler le nom de la stat
//Importer dans FetchList pour afficher le bon icon de chaque ligne de stat
export default function statNameFilter(string) {
  if (string.includes("à")) {
    const indexOfA = string.indexOf("à");
    const slice = string.slice(indexOfA + 2);

    const key = slice.replace(/-*\d+%* */, "");

    return key;
  } else {
    const key = string.replace(/-*\d+%* */, "");
    return key;
  }
}
