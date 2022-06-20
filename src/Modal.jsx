import "./styles.css";
import "./modal.css";
import { useState, useEffect } from "react";

import StatFilter from "./StatFilter";
import FetchList from "./FetchList";

export default function Modal({
  show,
  data,
  handleClose,
  title,
  baseStats,
  addToStuff,
  level,
  itemClicked
}) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const [filter, setFilter] = useState(0); //stat filtrée
  const [inputValue, setInputValue] = useState(""); //nom filtré

  useEffect(() => {
    setFilter(0);
  }, [data]);

  useEffect(() => {
    setInputValue("");
  }, [data]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  //Récupère la stat a filter
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-topbar">
          <div className="modal-topbar-title">{title}</div>
          <div className="modal-topbar-filter">
            <div className="modal-topbar-filter-name">
              <div className="filter-name-title">Nom</div>
              <input
                type="text"
                className="filter-name-input"
                onChange={handleInputChange}
                value={inputValue}
              />
            </div>
            <StatFilter
              baseStats={baseStats}
              handleChange={handleChange}
              filter={filter}
            />
          </div>
        </div>
        {data !== undefined ? (
          <FetchList
            addToStuff={addToStuff}
            itemClicked={itemClicked}
            level={level}
            data={data}
            filter={filter}
            inputValue={inputValue}
          />
        ) : (
          <div>Chargement...</div>
        )}
        <div className="modal-footer modal-topbar">
          <button
            type="button"
            onClick={() => {
              handleClose();
            }}
          >
            Fermer
          </button>
        </div>
      </section>
    </div>
  );
}
