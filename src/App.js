import React from "react";
import PartyData from "./models/PartyData";
import PartyCharacter from "./models/PartyCharacter";
import PartyHuntInput from "./views/PartyHuntInput/PartyHuntInput";
import PartyHuntData from "./views/PartyHuntData";
// import logo from './logo.svg';
// import './App.css';

const demoText =
  "Session data: From 2020-03-28, 17:00:59 to 2020-03-28, 17:41:51\n" +
  "Session: 00:40h\n" +
  "Loot Type: Market\n" +
  "Loot: 263,663\n" +
  "Supplies: 639,819\n" +
  "Balance: -376,156\n" +
  "Agent Navabi\n" +
  "    Loot: 2,678\n" +
  "    Supplies: 97,850\n" +
  "    Balance: -95,172\n" +
  "    Damage: 268,636\n" +
  "    Healing: 107,780\n" +
  "Cloud of Rain\n" +
  "    Loot: 34,218\n" +
  "    Supplies: 105,123\n" +
  "    Balance: -70,905\n" +
  "    Damage: 353,331\n" +
  "    Healing: 22\n" +
  "Dois Ca Dezenove\n" +
  "    Loot: 226,767\n" +
  "    Supplies: 72,322\n" +
  "    Balance: 154,445\n" +
  "    Damage: 251,215\n" +
  "    Healing: 55,211\n" +
  "Hamfast of Rain (Leader)\n" +
  "    Loot: 0\n" +
  "    Supplies: 210,369\n" +
  "    Balance: -210,369\n" +
  "    Damage: 378,296\n" +
  "    Healing: 420,165\n" +
  "Joaozin Cobrador\n" +
  "    Loot: 0\n" +
  "    Supplies: 154,155\n" +
  "    Balance: -154,155\n" +
  "    Damage: 386,087\n" +
  "    Healing: 355";

const stringToInt = (str) => {
  let int = parseInt(str, 10);
  if (isNaN(int)) {
    throw new Error();
  }
  return int;
};

const parseTime = (line) => {
  // Unparseable text
  if (line.search("Session: ") < 0) {
    throw new Error("Error on parsing time");
  }
  let _line = line;
  _line = _line.replace("Session: ", "");
  _line = _line.replace("h", "");
  let [hoursString, minutesString] = _line.split(":");
  const hours = parseInt(hoursString, 10);
  return parseInt(minutesString, 10) + hours * 60; // Hunt time in minutes
};

const parseLootType = (line) => {
  if (line.search("Loot Type: ") < 0) {
    throw new Error("Error on parse loot type");
  }
  const permittedLoot = ["Market", "Leader"];
  let _line = line;
  _line = _line.replace("Loot Type: ", "");
  if (!permittedLoot.includes(_line)) {
    throw new Error("Loot type not permitted");
  }
  return _line;
};

const parseLoot = (line) => {
  if (line.search("Loot: ") < 0) {
    throw new Error("Error on parse loot");
  }
  let _line = line;
  _line = _line.replace("Loot: ", "");
  _line = _line.replace(/,/g, "");
  const lootValue = parseInt(_line, 10);
  if (isNaN(lootValue)) {
    throw new Error("Loot value is not valid");
  }
  return lootValue;
};

const parseSupplies = (line) => {
  if (line.search("Supplies: ") < 0) {
    throw new Error("Error on parse supplies");
  }
  let _line = line;
  _line = _line.replace("Supplies: ", "");
  _line = _line.replace(/,/g, "");
  const suppliesValue = parseInt(_line, 10);
  if (isNaN(suppliesValue)) {
    throw new Error("Supplies value is not valid");
  }
  return suppliesValue;
};

const parseBalance = (line) => {
  if (line.search("Balance: ") < 0) {
    throw new Error("Error on parse balance");
  }
  let _line = line;
  _line = _line.replace("Balance: ", "");
  _line = _line.replace(/,/g, "");
  let balanceValue;
  try {
    balanceValue = stringToInt(_line);
  } catch (e) {
    console.error(e);
    throw new Error("Balance value is not valid");
  }
  return balanceValue;
};

const parseDamage = (line) => {
  if (line.search("Damage: ") < 0) {
    throw new Error("Error on parse damage");
  }
  let _line = line;
  _line = _line.replace("Damage: ", "");
  _line = _line.replace(/,/g, "");
  let damageValue;
  try {
    damageValue = stringToInt(_line);
  } catch (e) {
    console.error(e);
    throw new Error("Damage value is not valid");
  }
  return damageValue;
};

const parseHealing = (line) => {
  if (line.search("Healing: ") < 0) {
    throw new Error("Error on parse healing");
  }
  let _line = line;
  _line = _line.replace("Healing: ", "");
  _line = _line.replace(/,/g, "");
  let healingValue;
  try {
    healingValue = stringToInt(_line);
  } catch (e) {
    console.error(e);
    throw new Error("Healing value is not valid");
  }
  return healingValue;
};

const parseCharacterName = (line) => line.replace(" (Leader)", "");

const parseIsLeader = (line) => line.search("(Leader)") !== -1;

const parseCharacters = (lines) => {
  // Unexpected lines
  if (lines.length % 6 !== 0) {
    throw new Error("Error on parse character lines: Unexpected line count");
  }
  const chars = [];
  for (let i = 0; i < lines.length; i += 6) {
    const charLines = lines.slice(i, i + 6);

    chars.push(
      new PartyCharacter({
        name: parseCharacterName(charLines[0]),
        isLeader: parseIsLeader(charLines[0]),
        loot: parseLoot(charLines[1].trim()),
        supplies: parseSupplies(charLines[2].trim()),
        balance: parseBalance(charLines[3].trim()),
        damage: parseDamage(charLines[4].trim()),
        healing: parseHealing(charLines[5].trim()),
      })
    );
  }
  return chars;
};

const parseText = (ptText) => {
  const lines = ptText.split("\n");
  const huntTimeMinutes = parseTime(lines[1]);
  const lootType = parseLootType(lines[2]);
  const loot = parseLoot(lines[3]);
  const supplies = parseSupplies(lines[4]);
  const balance = parseBalance(lines[5]);
  const characterLines = lines.slice(6, lines.length);
  const chars = parseCharacters(characterLines);
  return new PartyData({
    time: huntTimeMinutes,
    lootType,
    loot,
    supplies,
    balance,
    chars,
  });
};

function App() {
  const [ptText, setPtText] = React.useState("");
  const [ptData, setPtData] = React.useState(null);
  const onChange = (e) => {
    setPtText(e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    try {
      const newPtData = parseText(ptText);
      setPtData(newPtData);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="App">
      {(ptData && <PartyHuntData ptData={ptData} />) || (
        <PartyHuntInput onChange={onChange} ptText={ptText} submit={submit} />
      )}
    </div>
  );
}

export default App;
