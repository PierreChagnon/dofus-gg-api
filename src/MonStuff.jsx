import "./styles.css";
import "./stuff.css";
import "./dropdown.css";
import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Modal from "./Modal";
import Weapon from "./Weapon";
import calculStatsFromStuff from "./services/calculStatsFromStuff.js";
import amulet from "./json/amulet.json";
import hat from "./json/hat.json";
import ring from "./json/ring.json";
import shield from "./json/shield.json";
import cape from "./json/cape.json";
import belt from "./json/belt.json";
import boots from "./json/boots.json";
import weapons from "./json/weapons.json";
import trophy from "./json/trophy.json";
import calculTotalStats from "./services/calculTotalStats";
import calculCapital from "./services/calculCapital.js";
import calculStatsFromSet from "./services/calculStatsFromSet";
import statNameFilter from "./services/statNameFilter.js";

export default function MonStuff() {
  const [dofusBox, setDofusBox] = useState(0); //State pour récupérer la bonne case du dofus sélectionnée
  const [distance, setDistance] = useState(false);
  const [bonusFromSet, setBonusFromSet] = useState(); //ce state nous sert juste à MAJ le DOM (deuxième valeurs de retour de calculStatsFromSet)
  const [statsFromSet, setStatsFromSet] = useState({});
  const [weapon, setWeapon] = useState(false);
  const [secondRing, setSecondRing] = useState(false);
  const [itemClicked, setItemClicked] = useState(false);
  const [level, setLevel] = useState(200);
  const [currentClasse, setCurrentClasse] = useState("Xélor");
  const [modalShow, setModalShow] = useState(false);
  const [dropdownShow, setDropdownShow] = useState(false);
  const [capital, setCapital] = useState(995);
  const [capitalUsed, setCapitalUsed] = useState(0);
  const [totalStats, setTotalStats] = useState({
    Vitalité: 0,
    Sagesse: 0,
    Force: 0,
    Intelligence: 0,
    Chance: 0,
    Agilité: 0,
    PA: 0,
    "% Critique": 0
  });

  const [stuff, setStuff] = useState({});
  const [baseStats, setBaseStats] = useState({
    Vitalité: 0,
    Sagesse: 0,
    Force: 0,
    Intelligence: 0,
    Chance: 0,
    Agilité: 0,
    "Retrait PA": 0,
    "Retrait PM": 0,
    "Esquive PA": 0,
    "Esquive PM": 0,
    Tacle: 0,
    Fuite: 0,
    Pods: 1000,
    Initiative: 0,
    Prospection: 100,
    PA: 7,
    PM: 3,
    Portée: 0,
    "% Critique": 0,
    Soins: 0,
    Invocations: 1,
    Puissance: 0,
    "Dommages Feu": 0,
    "Dommages Terre": 0,
    "Dommages Air": 0,
    "Dommages Eau": 0,
    "Dommages Neutre": 0,
    "Dommages Critiques": 0
  });
  const [statsFromStuff, setStatsFromStuff] = useState({
    Vitalité: 0,
    Sagesse: 0,
    Force: 0,
    Intelligence: 0,
    Chance: 0,
    Agilité: 0
  });
  const [data, setData] = useState();
  const [statsFromParcho, setStatsFromParcho] = useState({
    Vitalité: 0,
    Sagesse: 0,
    Force: 0,
    Intelligence: 0,
    Chance: 0,
    Agilité: 0
  });
  //const primaryStats = [{vita:1500, pa:7, pm:5, po:4, pp:200}]
  //const stats = ["vita", "sagesse", "force", "intel", "agi", "chance"];
  const classes = [
    "Xélor",
    "Ecaflip",
    "Eniripsa",
    "Iop",
    "Crâ",
    "Féca",
    "Sacrieur",
    "Sadida",
    "Osamodas",
    "Enutrof",
    "Sram",
    "Pandawa",
    "Roublard",
    "Zobal",
    "Steamer",
    "Eliotrope",
    "Huppermage",
    "Ouginak"
  ];

  useEffect(() => {
    setTotalStats(
      calculTotalStats(statsFromStuff, statsFromParcho, baseStats, level)
    );
  }, [statsFromStuff, statsFromParcho, baseStats, level]);

  useEffect(() => {
    setStatsFromStuff(calculStatsFromStuff(stuff, statsFromSet));
  }, [stuff, statsFromSet]);

  useEffect(() => {
    //Ne pas oublier que cette fonction renvois un tableau de 2 valeurs
    //Ici on veut accéder à la première (finalRes)
    const res = calculStatsFromSet(stuff);
    const finalRes = res[0];
    const bonusAndNames = res[1];
    setStatsFromSet(finalRes); //injecté ensuite dans calculStatsFromStuff
    setBonusFromSet(bonusAndNames); //Pour le DOM
  }, [stuff]);

  useEffect(() => {
    setBaseStats({
      ...baseStats,
      Pods: 995 + level * 5,
      PA: 6 + Math.min(Math.floor(level / 100), 1)
    });
  }, [level]);

  useEffect(() => {
    setCapital(level * 5 - 5);
  }, [level]);

  useEffect(() => {
    setCapitalUsed(calculCapital(baseStats));
  }, [baseStats]);

  const addToStuff = (type, item) => {
    if (secondRing) {
      type = "Anneau2";
    }
    if (weapon) {
      type = "Armes"; //car les armes ont un type particulier (pelles, dagues, épées etc.)
    }
    if (dofusBox > 0) {
      type = `dofus-${dofusBox}`;
    }
    const newStuff = { ...stuff, [type]: item };
    setStuff(newStuff);

    // On utilise ca pour redéfinir le bon item-grid dont on doit modifier la background image
    setSecondRing(false);
    setWeapon(false);
    setDofusBox(0);
    setData();

    setModalShow(false);

    const imgUrl = item.imgPath;
    const element = document.getElementById(type);
    if (!element.classList.contains("has-item")) {
      element.classList.toggle("has-item"); //ajoute la couleur bleu sur l'hover
    }
    if (
      !element
        .getElementsByClassName("delete")[0]
        .classList.contains("delete-display")
    ) {
      element
        .getElementsByClassName("delete")[0]
        .classList.toggle("delete-display"); //Pour l'item, ajoute le bouton delete
    }
    element.style.backgroundImage = `url(${imgUrl})`;
    element.style.backgroundSize = "100%";

    // console.log(stuff);
  };

  const handleItemClick = (type) => {
    setItemClicked(!itemClicked);
    switch (type) {
      case "Amulette":
        setData(amulet);
        break;
      case "Anneau":
        setData(ring);
        break;
      case "Anneau2":
        setData(ring);
        setSecondRing(true);
        break;
      case "Bouclier":
        setData(shield);
        break;
      case "Chapeau":
        setData(hat);
        break;
      case "Cape":
        setData(cape);
        break;
      case "Ceinture":
        setData(belt);
        break;
      case "Bottes":
        setData(boots);
        break;
      case "Armes":
        setData(weapons);
        setWeapon(true);
        break;
      case "dofus-1":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      case "dofus-2":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      case "dofus-3":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      case "dofus-4":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      case "dofus-5":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      case "dofus-6":
        setData(trophy);
        setDofusBox(type.match(/\d+/));
        break;
      default:
        return;
    }
    setModalShow(true);
  };

  const hideModal = () => {
    setModalShow(false);
    setData();
  };

  const showDropdown = () => {
    setDropdownShow(!dropdownShow);
  };

  const hideDropdown = () => {
    setDropdownShow(false);
  };

  const handleParchoClick = (value, parchoValue) => {
    for (let i = 0; i < Object.keys(statsFromParcho).length; i++) {
      const key = Object.keys(statsFromParcho)[i];
      parchoValue = { ...parchoValue, [key]: value };
    }
    const element = document.getElementsByClassName("input-parcho");
    for (let i = 0; i < element.length; i++) {
      const input = element[i];
      input.value = value;
    }
    setStatsFromParcho(parchoValue);
  };

  const handleParchoInput = (value, parchoKey, id) => {
    if (value > 100) {
      value = 100;
    } else if (value === "") {
      value = 0;
    }
    const element = document.getElementById(id);
    if (value > 100) {
      element.value = 100;
    } else {
      element.value = value;
    }

    setStatsFromParcho({ ...statsFromParcho, [parchoKey]: value });
  };

  const handleStatInput = (value, statKey, id) => {
    const element = document.getElementById(id);
    element.value = value;
    setBaseStats({ ...baseStats, [statKey]: value });
  };

  const handleLevelInput = (value, id) => {
    if (value > 200) {
      value = 200;
    } else if (value === "") {
      value = 0;
    }
    const element = document.getElementById(id);
    if (value > 200) {
      element.value = 200;
    } else {
      element.value = value;
    }
    setLevel(value);
  };

  const deleteItem = (parentID) => {

    //On enleve l'item du stuff
    const temp = stuff; 
    delete temp[parentID]
    //console.log(temp)

    setStuff(temp); // Pour mettre à jour les stats lorsqu'on retire l'item
    setStatsFromStuff(calculStatsFromStuff(temp, statsFromSet))
    
    //On récupère la bonne div et on lui remet son image initiale
    const element = document.getElementById(parentID);
    
    //reset les classes pour revenir a la div par défault
    element
      .getElementsByClassName("delete")[0]
      .classList.toggle("delete-display");
    element.classList.toggle("has-item");
    let imgTag = parentID;
    //Sélectionne le bon tag dans ces cas la
    if (parentID === "Anneau2") {
      imgTag = "Anneau";
    }
    if (parentID.includes("dofus")) {
      imgTag = "Dofus";
    }
    //remet l'image opacity
    element.style.backgroundImage = `url(assets/items/${imgTag}_opacity.png)`;
    //remet la bonne taille
    element.style.backgroundSize = "75%";
  };

  return (
    <div>
      <Modal
        show={modalShow}
        handleClose={hideModal}
        title={data !== undefined ? data[0].type : ""}
        baseStats={baseStats}
        data={data}
        addToStuff={addToStuff}
        level={level}
        itemClicked={itemClicked}
      ></Modal>
      <Topbar />
      <div className="container site">
        <div className="sidebar">
          <div className="sidebar-primary noselect">
            <div className="stats hoverable">
              <img src="assets/icon_vita.png" alt="" />
              {totalStats["Vitalité"] !== undefined
                ? totalStats["Vitalité"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_PA.png" alt="" />
              {totalStats["PA"] !== undefined ? totalStats["PA"] : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_PM.png" alt="" />
              {totalStats["PM"] !== undefined ? totalStats["PM"] : 3}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_PO.png" alt="" />
              {totalStats["Portée"] !== undefined ? totalStats["Portée"] : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_PP.png" alt="" />
              {totalStats["Prospection"] !== undefined
                ? totalStats["Prospection"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_init.png" alt="" />
              {totalStats["Initiative"] !== undefined
                ? totalStats["Initiative"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_crit.png" alt="" />
              {totalStats["% Critique"] !== undefined
                ? totalStats["% Critique"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_soin.png" alt="" />
              {totalStats["Soins"] !== undefined ? totalStats["Soins"] : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_invoc.png" alt="" />
              {totalStats["Invocations"] !== undefined
                ? totalStats["Invocations"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/icon_pui.png" alt="" />
              {totalStats["Puissance"] !== undefined
                ? totalStats["Puissance"]
                : 0}
            </div>
          </div>
          <div className="separateur"></div>
          <div className="sidebar-stats">
            <div className="stats-line vita">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="vita"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Vitalité",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Vitalité",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                id="parcho-vita"
                defaultValue={0}
                type="number"
              />

              <div className="cell">
                {statsFromStuff["Vitalité"] !== undefined
                  ? statsFromStuff["Vitalité"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Vitalité"] !== undefined
                  ? totalStats["Vitalité"] - (50 + level * 5)
                  : 0}
              </div>
            </div>
            <div className="stats-line sagesse">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="sagesse"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Sagesse",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Sagesse",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                id="parcho-sagesse"
                defaultValue={0}
                type="number"
              />

              <div className="cell">
                {statsFromStuff["Sagesse"] !== undefined
                  ? statsFromStuff["Sagesse"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Sagesse"] !== undefined
                  ? totalStats["Sagesse"]
                  : 0}
              </div>
            </div>
            <div className="stats-line force">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="force"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Force",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Force",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                defaultValue={0}
                type="number"
                id="parcho-force"
              />
              <div className="cell">
                {statsFromStuff["Force"] !== undefined
                  ? statsFromStuff["Force"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Force"] !== undefined ? totalStats["Force"] : 0}
              </div>
            </div>
            <div className="stats-line intel">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="intel"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Intelligence",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Intelligence",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                defaultValue={0}
                type="number"
                id="parcho-intel"
              />
              <div className="cell">
                {statsFromStuff["Intelligence"] !== undefined
                  ? statsFromStuff["Intelligence"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Intelligence"] !== undefined
                  ? totalStats["Intelligence"]
                  : 0}
              </div>
            </div>
            <div className="stats-line chance">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="chance"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Chance",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Chance",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                defaultValue={0}
                type="number"
                id="parcho-chance"
              />
              <div className="cell">
                {statsFromStuff["Chance"] !== undefined
                  ? statsFromStuff["Chance"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Chance"] !== undefined ? totalStats["Chance"] : 0}
              </div>
            </div>
            <div className="stats-line agi">
              <input
                className="input-stats cell"
                defaultValue={0}
                type="number"
                id="agi"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleStatInput(
                    e.currentTarget.value,
                    "Agilité",
                    e.currentTarget.id
                  );
                }}
              />
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleParchoInput(
                    e.currentTarget.value,
                    "Agilité",
                    e.currentTarget.id
                  );
                }}
                className="input-parcho cell"
                defaultValue={0}
                type="number"
                id="parcho-agi"
              />
              <div className="cell">
                {statsFromStuff["Agilité"] !== undefined
                  ? statsFromStuff["Agilité"]
                  : 0}
              </div>
              <div className="cell hoverable">
                {totalStats["Agilité"] !== undefined
                  ? totalStats["Agilité"]
                  : 0}
              </div>
            </div>
            <div className="capital">
              <div className="capital-points">
                <div className="cell">Capital:</div>
                <div className="cell">{capital - capitalUsed}</div>
              </div>
              <div className="parcho">
                <button
                  onClick={(e) => {
                    handleParchoClick(e.currentTarget.value, statsFromParcho);
                  }}
                  value="0"
                  className="parcho-button"
                >
                  0
                </button>
                <button
                  onClick={(e) => {
                    handleParchoClick(e.currentTarget.value, statsFromParcho);
                  }}
                  value="100"
                  className="parcho-button"
                >
                  100
                </button>
              </div>
            </div>
          </div>
        </div>
        <main className="main">
          <div className="stuff">
            <div className="stuff-block-classe">
              <div className="dropdown">
                <button onClick={showDropdown} className="dropbtn">
                  {currentClasse}
                </button>
                <div
                  className={
                    dropdownShow
                      ? "dropdown-content display"
                      : "dropdown-content"
                  }
                >
                  {classes.map((classe, i) => {
                    return (
                      <div
                        key={i}
                        id={classe}
                        onClick={(e) => {
                          setCurrentClasse(e.currentTarget.id);
                          hideDropdown();
                        }}
                      >
                        {classe}
                      </div>
                    );
                  })}
                </div>
              </div>
              <input
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  handleLevelInput(e.currentTarget.value, e.currentTarget.id);
                }}
                type="number"
                className="level"
                defaultValue={200}
                id="level"
              />
            </div>
            <div className="stuff-block-perso">
              <img src={`./assets/classes/${currentClasse}.png`} alt="" />
            </div>
            {/* TECHNIQUE POUR AFFICHER L'ITEM AU SURVOL ?? https://www.w3schools.com/css/tryit.asp?filename=trycss_dropdown_text */}
            <div
              id="Amulette"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-1"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Anneau"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-2"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Anneau2"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-3"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Bouclier"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-4"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Chapeau"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-5"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Cape"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-6"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Ceinture"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-7"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Bottes"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-8"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="Armes"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="item stuff-block-9"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="pet"
              // onClick={(e) => {
              //   handleItemClick(e.currentTarget.id);
              // }}
              className="item stuff-block-10"
            ></div>
            <div
              id="dofus-1"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-11"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="dofus-2"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-12"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="dofus-3"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-13"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="dofus-4"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-14"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="dofus-5"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-15"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
            <div
              id="dofus-6"
              onClick={(e) => {
                handleItemClick(e.currentTarget.id);
              }}
              className="dofus item stuff-block-16"
            >
              <button
                onClick={(e) => {
                  deleteItem(e.currentTarget.parentNode.id);
                  e.stopPropagation();
                }}
                className="delete"
              >
                X
              </button>
            </div>
          </div>
        </main>
        <aside className="aside">
          <div className="aside-damages noselect">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <img src="assets/fetch_stats_assets/Neutre.png" alt="neutre" />
                  </th>
                  <th>
                    <img src="assets/fetch_stats_assets/Force.png" alt="terre" />
                  </th>
                  <th>
                    <img src="assets/fetch_stats_assets/Intelligence.png" alt="feu" />
                  </th>
                  <th>
                    <img src="assets/fetch_stats_assets/Chance.png" alt="chance" />
                  </th>
                  <th>
                    <img src="assets/fetch_stats_assets/Agilité.png" alt="agi" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Do</th>
                  <td>
                    {statsFromStuff["Dommages Neutre"] !== undefined
                      ? statsFromStuff["Dommages Neutre"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Dommages Terre"] !== undefined
                      ? statsFromStuff["Dommages Terre"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Dommages Feu"] !== undefined
                      ? statsFromStuff["Dommages Feu"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Dommages Eau"] !== undefined
                      ? statsFromStuff["Dommages Eau"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Dommages Air"] !== undefined
                      ? statsFromStuff["Dommages Air"]
                      : 0}
                  </td>
                </tr>
                <tr>
                  <th>Res</th>
                  <td>
                    {statsFromStuff["Résistance Neutre"] !== undefined
                      ? statsFromStuff["Résistance Neutre"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Résistance Terre"] !== undefined
                      ? statsFromStuff["Résistance Terre"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Résistance Feu"] !== undefined
                      ? statsFromStuff["Résistance Feu"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Résistance Eau"] !== undefined
                      ? statsFromStuff["Résistance Eau"]
                      : 0}
                  </td>
                  <td>
                    {statsFromStuff["Résistance Air"] !== undefined
                      ? statsFromStuff["Résistance Air"]
                      : 0}
                  </td>
                </tr>
                <tr>
                  <th>%Res</th>
                  <td>
                    {statsFromStuff["% Résistance Neutre"] !== undefined
                      ? statsFromStuff["% Résistance Neutre"] + "%"
                      : 0 + "%"}
                  </td>
                  <td>
                    {statsFromStuff["% Résistance Terre"] !== undefined
                      ? statsFromStuff["% Résistance Terre"] + "%"
                      : 0 + "%"}
                  </td>
                  <td>
                    {statsFromStuff["% Résistance Feu"] !== undefined
                      ? statsFromStuff["% Résistance Feu"] + "%"
                      : 0 + "%"}
                  </td>
                  <td>
                    {statsFromStuff["% Résistance Eau"] !== undefined
                      ? statsFromStuff["% Résistance Eau"] + "%"
                      : 0 + "%"}
                  </td>
                  <td>
                    {statsFromStuff["% Résistance Air"] !== undefined
                      ? statsFromStuff["% Résistance Air"] + "%"
                      : 0 + "%"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="separateur"></div>
          <div className="sidebar-primary aside-secondary noselect">
            <div className="col1">
              <div className="stats hoverable">
                <img src="assets/secondary/icon_dosort.png" alt="" />
                {statsFromStuff["% Dommages aux sorts"] !== undefined
                  ? statsFromStuff["% Dommages aux sorts"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_dosort.png" alt="" />
                {statsFromStuff["% Dommages d'armes"] !== undefined
                  ? statsFromStuff["% Dommages d'armes"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_dopiege.png" alt="" />
                {statsFromStuff["Dommages Pièges"] !== undefined
                  ? statsFromStuff["Dommages Pièges"]
                  : 0}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_puipiege.png" alt="" />
                {statsFromStuff["Puissance (pièges)"] !== undefined
                  ? statsFromStuff["Puissance (pièges)"]
                  : 0}
              </div>
            </div>
            <div className="col2">
              <div className="stats hoverable">
                <img src="assets/secondary/icon_dodistance.png" alt="" />
                {statsFromStuff["Dommages distance"] !== undefined
                  ? statsFromStuff["Dommages distance"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_domelee.png" alt="" />
                {statsFromStuff["Dommages mêlée"] !== undefined
                  ? statsFromStuff["Dommages mêlée"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_docrit.png" alt="" />
                {statsFromStuff["Dommages Critiques"] !== undefined
                  ? statsFromStuff["Dommages Critiques"]
                  : 0}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_dopou.png" alt="" />
                {statsFromStuff["Dommages Poussée"] !== undefined
                  ? statsFromStuff["Dommages Poussée"]
                  : 0}
              </div>
            </div>
            <div className="col3">
              <div className="stats hoverable">
                <img src="assets/secondary/icon_resdodi.png" alt="" />
                {statsFromStuff["Résistance distance"] !== undefined
                  ? statsFromStuff["Résistance distance"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_resdomel.png" alt="" />
                {statsFromStuff["Résistance mêlée"] !== undefined
                  ? statsFromStuff["Résistance mêlée"] + "%"
                  : 0 + "%"}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_resdocrit.png" alt="" />
                {statsFromStuff["Résistance Critiques"] !== undefined
                  ? statsFromStuff["Résistance Critiques"]
                  : 0}
              </div>
              <div className="stats hoverable">
                <img src="assets/secondary/icon_resdopou.png" alt="" />
                {statsFromStuff["Résistance Poussée"] !== undefined
                  ? statsFromStuff["Résistance Poussée"]
                  : 0}
              </div>
            </div>
          </div>
          <div className="separateur"></div>
          <div className="sidebar-primary aside-secondary noselect">
            <div className="stats hoverable">
              <img src="assets/secondary/icon_retpa.png" alt="" />
              {totalStats["Retrait PA"] !== undefined
                ? totalStats["Retrait PA"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_esqpa.png" alt="" />
              {totalStats["Esquive PA"] !== undefined
                ? totalStats["Esquive PA"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_tacle.png" alt="" />
              {totalStats["Tacle"] !== undefined ? totalStats["Tacle"] : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_retpm.png" alt="" />
              {totalStats["Retrait PM"] !== undefined
                ? totalStats["Retrait PM"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_esqpm.png" alt="" />
              {totalStats["Esquive PM"] !== undefined
                ? totalStats["Esquive PM"]
                : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_fuite.png" alt="" />
              {totalStats["Fuite"] !== undefined ? totalStats["Fuite"] : 0}
            </div>
            <div className="stats hoverable">
              <img src="assets/secondary/icon_pods.png" alt="" />
              {totalStats["Pods"] !== undefined ? totalStats["Pods"] : 0}
            </div>
          </div>
          <div className="separateur"></div>
          <div className="set-container noselect">
            <h3 className="set-title">Panoplies équipées</h3>
            {Object.keys(statsFromSet).length <= 0 ? (
              <div className="noset">Aucun bonus de panoplie</div>
            ) : (
              bonusFromSet.map((set) => {
                return (
                  <div className="set">
                    <div className="set-name">{set.name}</div>
                    <div className="set-separateur"></div>
                    <div className="set-bonus">
                      {set.bonus.map((stat) => {
                        const icon = statNameFilter(stat);
                        return (
                          <div className="set-statline">
                            <img
                              src={`./assets/fetch_stats_assets/${icon}.png`}
                              alt=""
                            />
                            <div>{stat}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
      <div className="container-damages">
        <div className="damages-topbar">
          <h3>Dégâts</h3>
          <div className="damages-range">
            <button>mêlée</button>
            <button>distance</button>
          </div>
        </div>
        {stuff["Armes"] !== undefined ? (
          <div className="weapon">
            <Weapon
              weapon={stuff["Armes"]}
              totalStats={totalStats}
              distance={distance}
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="spells"></div>
      </div>
    </div>
  );
}
