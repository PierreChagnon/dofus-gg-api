export default function calculTotalStats(
  statsFromStuff,
  statsFromParcho,
  baseStats,
  level
) {
  var totalStats = {};
  Object.keys(baseStats).forEach((stat) => {
    const i = isNaN(Number(statsFromStuff[stat]))
      ? 0
      : Number(statsFromStuff[stat]);
    const j = isNaN(Number(statsFromParcho[stat]))
      ? 0
      : Number(statsFromParcho[stat]);
    const k = isNaN(Number(baseStats[stat])) ? 0 : Number(baseStats[stat]);

    const total = i + j + k;

    totalStats = { ...totalStats, [stat]: total };
  });
  // Calcul tacle, fuite, retraits, pods, initiative, PP
  totalStats = {
    ...totalStats,
    Vitalité: totalStats["Vitalité"] + 50 + level * 5,
    Fuite: totalStats["Fuite"] + Math.floor(totalStats["Agilité"] / 10),
    Tacle: totalStats["Tacle"] + Math.floor(totalStats["Agilité"] / 10),
    "Retrait PA":
      totalStats["Retrait PA"] + Math.floor(totalStats["Sagesse"] / 10),
    "Retrait PM":
      totalStats["Retrait PM"] + Math.floor(totalStats["Sagesse"] / 10),
    "Esquive PA":
      totalStats["Esquive PA"] + Math.floor(totalStats["Sagesse"] / 10),
    "Esquive PM":
      totalStats["Esquive PM"] + Math.floor(totalStats["Sagesse"] / 10),
    Pods: totalStats["Pods"] + totalStats["Force"] * 5,
    Initiative:
      totalStats["Initiative"] +
      totalStats["Force"] +
      totalStats["Intelligence"] +
      totalStats["Chance"] +
      totalStats["Agilité"],
    Prospection:
      totalStats["Prospection"] + Math.floor(totalStats["Chance"] / 10)
  };

  return totalStats;
}
