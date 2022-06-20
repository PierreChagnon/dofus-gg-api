import "./styles.css";
import "./modal.css";
import statNameFilter from "./services/statNameFilter.js";
import listFiltered from "./services/listFiltered.js";
import { useState, useEffect, useRef } from "react";

export default function FetchList({
  addToStuff,
  data,
  level,
  itemClicked,
  filter,
  inputValue //le filtre par nom
}) {
  const listInnerRef = useRef();
  const [dataFiltered, setDataFiltered] = useState(data);
  const [listSize, setListSize] = useState(25); //Taille de la liste avant le rafraichissement "on scroll end"
  //Pour mettre a jour le nombre de div qui ne sont pas display après le name filter
  const [notDisplayCount, setNotDisplayCount] = useState(0);

  //Fonction pour raffraichir la liste "on scroll end"
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight + 5 >= scrollHeight) {
        //On met un pas pour être sur de rafraichir en arrivant en bas
        setListSize(listSize * 2);
        console.log("Reached bottom");
      }
    }
  };

  const fetchListStillHasElement = () => {
    const df = dataFiltered.length;
    if (df - notDisplayCount <= 0) {
      return false;
    } else {
      return true;
    }
  };

  //Filtre en fonction du level et de la stat
  useEffect(() => {
    setDataFiltered(listFiltered(data, filter, level, listSize, inputValue));
  }, [inputValue, data, level, itemClicked, filter, listSize]);

  //Filtre en fonction du nom
  //On pourrait peut etre le faire dans listFiltered
  //Mais on essaie la technique des display:none (surement plus rapide)
  useEffect(() => {
    const elements = document.getElementsByClassName("list-item");
    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const name = dataFiltered[i].name;
      if (name.toUpperCase().indexOf(inputValue.toUpperCase()) > -1) {
        element.style.display = "";
      } else {
        element.style.display = "none";
        setNotDisplayCount(notDisplayCount + 1);
      }
    }
  }, [inputValue, dataFiltered]);

  return (
    <div className="list" onScroll={() => onScroll()} ref={listInnerRef}>
      {dataFiltered.map((item, i) => {
        return (
          <div
            onClick={() => {
              addToStuff(item.type, item);
            }}
            key={i}
            className="list-item"
            name={item.name}
          >
            <div className="list-item-topbar">
              <img src={item.imgPath} alt="" />
              <div className="list-item-topbar-name">
                <div>{item.name}</div>
                <a href="https://45ib8.csb.app/">{item.set.setName}</a>
              </div>
              <div className="list-item-topbar-level">
                Niveau{" " + item.level}
              </div>
            </div>
            <div className="separateur"></div>
            <div className="list-item-stats">
              {item.stats.map((stat, i) => {
                let iconURL = "";
                if (stat.includes("(")) {
                  const string = stat.match(/\(([^)]+)\)/)[1];
                  const element = string.match(/\w+$/);
                  iconURL = `assets/weapon_elements/${element}.png`;
                } else {
                  const element = statNameFilter(stat);
                  iconURL = `./assets/fetch_stats_assets/${element}.png`;
                }
                return (
                  <div
                    style={stat.indexOf("-") !== -1 ? { color: "red" } : {}}
                    className="stat-fetch"
                    key={i}
                  >
                    <img src={iconURL} alt="" />
                    {stat}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
