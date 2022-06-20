import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useBorderSelectStyles } from "@mui-treasury/styles/select/border";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import makeStatList from "./services/makeStatList.js";

import "./modal.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: " 40%",
    background: "#181818",
    border: "solid 1px rgba(255, 255, 255, 0.5)",
    borderRadius: "5px",
    padding: "0px 5px"
  },
  select: {
    fontSize: "14px",
    lineHeight: "50px",
    color: "rgb(255, 255, 255, 0.8)",
    height: "50px"
  },
  item: {}
}));

// Original design here: https://github.com/siriwatknp/mui-treasury/issues/541

const BorderSelect = ({ baseStats, filter, handleChange }) => {
  const borderSelectClasses = useBorderSelectStyles();
  const [statList, setStatList] = useState([]);

  useEffect(() => {
    setStatList(makeStatList(baseStats)); //On doit faire une liste de stat pour le filtre
    //On peutle faire directement dans l'initialisation du state
    //Pour éviter l'erreur de missing dependancy
    //Après on aura l'erreur du setState non utilisé ...
    //donc bon ...
  }, [baseStats]);
  // moves the menu below the select input
  const menuProps = {
    classes: {
      list: borderSelectClasses.list
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreIcon
        className={props.className + " " + borderSelectClasses.icon}
      />
    );
  };
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <Select
        className={classes.select}
        disableUnderline
        displayEmpty
        labelId="inputLabel"
        IconComponent={iconComponent}
        MenuProps={menuProps}
        value={filter}
        onChange={handleChange}
      >
        <MenuItem className={classes.item} value={0}>
          Aucun filtre
        </MenuItem>
        {statList.map((stat, i) => {
          const icon = stat.replace(/%* */, "");
          return (
            <MenuItem className={classes.item} key={i} value={stat}>
              <img
                className="statfilter-img"
                src={`./assets/fetch_stats_assets/${icon}.png`}
                alt=""
              />
              {stat}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default BorderSelect;
