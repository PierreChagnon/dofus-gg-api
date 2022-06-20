import { useState, useEffect } from "react";
import "./styles.css";
import handleWeaponDamages from "./services/handleWeaponDamages";
import calculWeaponDamages from "./services/calculWeaponDamages";
import calculWeaponTotalDamages from "./services/calculWeaponTotalDamages";
import calculWeaponMeanDamages from "./services/calculWeaponMeanDamages";

export default function Weapon({ weapon, totalStats, distance }) {
  const [normalDamages, setNormalDamages] = useState([0, 0]);
  const [critDamages, setCritDamages] = useState([0, 0]);
  const [totalNormalDamages, setTotalNormalDamages] = useState(
    calculWeaponTotalDamages(normalDamages)
  );
  const [totalCritDamages, setTotalCritDamages] = useState(
    calculWeaponTotalDamages(critDamages)
  );
  const [meanDamages, setMeanDamages] = useState([0, 0]);

  const [damageLines, setDamageLines] = useState(handleWeaponDamages(weapon));
  const PA = Number(weapon.carac[0].match(/\d/));
  const PO = Number(weapon.carac[1].match(/\d+$/));
  const CCWithSlash = weapon.carac[2].match(/\/\d+/);
  const CCweapon = Number(String(CCWithSlash).replace(/\//, ""));
  const [CC, setCC] = useState(totalStats["% Critique"] + CCweapon);
  const [bonusCC, setBonusCC] = useState(
    Number(String(weapon.carac[2].match(/\++\d+/)).replace("+", ""))
  );

  ////////////////////////
  ///////USE EFFECT///////
  ////////////////////////
  useEffect(() => {
    setDamageLines(handleWeaponDamages(weapon));
  }, [weapon]);

  useEffect(() => {
    setTotalNormalDamages(calculWeaponTotalDamages(normalDamages));
  }, [normalDamages, weapon]);

  useEffect(() => {
    setTotalCritDamages(calculWeaponTotalDamages(critDamages));
  }, [critDamages, weapon]);

  useEffect(() => {
    setCC(totalStats["% Critique"] + CCweapon);
  }, [totalStats, CCweapon]);

  useEffect(() => {
    setBonusCC(
      Number(String(weapon.carac[2].match(/\++\d+/)).replace("+", ""))
    );
  }, [weapon]);

  //Calcul des dégats critiques
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < damageLines.length; i++) {
      const line = damageLines[i];
      const element = String(line.name.match(/\w+$/));

      //Calcul des dégats critiques
      const from = calculWeaponDamages(
        Number(line.value[0]) + bonusCC,
        element,
        totalStats,
        true,
        distance
      );
      const to = calculWeaponDamages(
        Number(line.value[1]) + bonusCC,
        element,
        totalStats,
        true,
        distance
      );
      //Push dans arr et setState
      arr.push([from, to]);
    }
    setCritDamages(arr);
  }, [distance, totalStats, damageLines, bonusCC, weapon]);

  //Calcul des dégats normaux
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < damageLines.length; i++) {
      const line = damageLines[i];
      const element =
        String(line.name.match(/\w+$/)) === "rendus"
          ? "rendus"
          : String(line.name.match(/\w+$/));
      console.log("element : " + element);

      //Calcul des dégats normaux
      const from = calculWeaponDamages(
        Number(line.value[0]),
        element,
        totalStats,
        false,
        distance
      );
      const to = calculWeaponDamages(
        Number(line.value[1]),
        element,
        totalStats,
        false,
        distance
      );
      //Push dans arr et setState
      arr.push([from, to]);
    }
    setNormalDamages(arr);
  }, [distance, totalStats, damageLines, weapon]);

  //calcul des dégats moyens
  useEffect(() => {
    setMeanDamages(
      calculWeaponMeanDamages(totalNormalDamages, totalCritDamages, CC)
    );
  }, [totalNormalDamages, totalCritDamages, CC, weapon]);

  return (
    <div className="weapon-card">
      <div className="weapon-topbar">
        <img src={weapon.imgPath} alt="" />
        <div className="weapon-info">
          <div className="weapon-info-top">
            <div className="weapon-name">{weapon.name}</div>
            <span>-</span>
            <div className="weapon-level">{"Niveau " + weapon.level}</div>
          </div>
          <div className="weapon-info-bot">
            <div className="weapon-caracteristics">
              <img src="assets/fetch_stats_assets/PA.png" alt="" />
              <div>{PA}</div>
            </div>
            <div className="weapon-caracteristics">
              <img src="assets/fetch_stats_assets/Portée.png" alt="" />
              {PO}
            </div>
            <div className="weapon-caracteristics">
              <img src="assets/fetch_stats_assets/Critique.png" alt="" />
              {`${CCweapon}% (+${bonusCC})`}
            </div>
          </div>
        </div>
      </div>
      <div className="weapon-damages">
        <div className="weapon-damages-topbar">dégats calculés</div>
        <div className="damages-mean">{`Dégats moyens : ${Math.round(
          (meanDamages[0] + meanDamages[1]) / 2
        )} (${meanDamages[0]} à ${meanDamages[1]})`}</div>
        <div>{`Probabilité de CC: ${CC}%`} </div>
        <div className="damages-details">
          <div className="damages-details-col">
            <div className="line-head">Normal</div>
            {damageLines.map((damage, i) => {
              const element = String(damage.name.match(/\w+$/));

              const iconURL = `assets/weapon_elements/${element}.png`;

              return (
                <div key={i} className="line">
                  <img src={iconURL} alt="" />
                  {normalDamages[i][0] + " à " + normalDamages[i][1]}
                </div>
              );
            })}
            <div className="total line">
              {"Total : " +
                totalNormalDamages[0] +
                " à " +
                totalNormalDamages[1]}
            </div>
          </div>
          <div className="damages-details-col">
            <div className="line-head">Critique</div>
            {damageLines.map((damage, i) => {
              const element = String(damage.name.match(/\w+$/));

              const iconURL = `assets/weapon_elements/${element}.png`;
              return (
                <div key={i} className="line">
                  <img src={iconURL} alt="" />
                  {critDamages[i][0] + " à " + critDamages[i][1]}
                  <img
                    className="icon-crit"
                    src="assets/fetch_stats_assets/Critique.png"
                    alt=""
                  />
                </div>
              );
            })}
            <div className="total line">
              {"Total : " + totalCritDamages[0] + " à " + totalCritDamages[1]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
