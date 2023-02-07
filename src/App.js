import "./App.css";
import * as React from "react";
import * as cheerio from "cheerio";
import { useState } from "react";
import Bar from "./components/bar";
import Table from "./components/table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Dialog, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {
  AddBox,
  IndeterminateCheckBox,
  DisabledByDefault,
} from "@mui/icons-material";
import {
  abilityModifiers,
  AC,
  areaDamage,
  getEquivalentValueWithLevel,
  HP,
  perception,
  savingThrows,
  spells,
  strikeAttackBonus,
  strikeDamage,
} from "./tables/monsterbuild";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [opened, setOpened] = useState([]);
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [playersLevel, setPlayersLevels] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    const oldList = JSON.parse(localStorage.getItem("list"));

    if (oldList) {
      setList(oldList);
    }

    const oldminlevel = JSON.parse(localStorage.getItem("minLevel"));

    if (oldminlevel) {
      setMinLevel(oldminlevel);
    }

    const oldmaxlevel = JSON.parse(localStorage.getItem("maxLevel"));

    if (oldmaxlevel) {
      setMaxLevel(oldmaxlevel);
    }

    const oldplayerslevel = JSON.parse(localStorage.getItem("playersLevel"));
    if (oldplayerslevel) {
      setPlayersLevels(oldplayerslevel);
    }

    const oldplayercount = JSON.parse(localStorage.getItem("playerCount"));

    if (oldplayercount) {
      setPlayerCount(oldplayercount);
    }

    const oldshowtable = JSON.parse(localStorage.getItem("showTable"));
    if (oldshowtable !== null) {
      setShowTable(oldshowtable);
    }

    setIsInitializing(false);
  }, []);

  React.useEffect(() => {
    if (isInitializing === false) {
      localStorage.setItem("list", JSON.stringify(list));
    }
  }, [list, isInitializing]);

  React.useEffect(() => {
    if (isInitializing === false) {
      localStorage.setItem("showTable", JSON.stringify(showTable));
    }
  }, [showTable, isInitializing]);

  React.useEffect(() => {
    if (isInitializing === false) {
      localStorage.setItem("minLevel", JSON.stringify(minLevel));
      localStorage.setItem("maxLevel", JSON.stringify(maxLevel));
    }
  }, [minLevel, maxLevel, isInitializing]);

  React.useEffect(() => {
    if (isInitializing === false) {
      localStorage.setItem("playersLevel", JSON.stringify(playersLevel));
    }
  }, [playersLevel, isInitializing]);

  React.useEffect(() => {
    if (isInitializing === false) {
      localStorage.setItem("playerCount", JSON.stringify(playerCount));
    }
  }, [playerCount, isInitializing]);

  React.useEffect(() => {
    fetch("./list.json")
      .then((res) => res.json())
      .then((json) => {
        const creatures = [];

        for (const key of Object.keys(json)) {
          var array = [];

          array = json[key];

          if (array) {
            array.forEach(async (creature) => {
              creature.trait_raw = creature.trait_raw.join(", ");

              var push = true;
              if (search !== "") {
                if (
                  creature.name.toLowerCase().indexOf(search.toLowerCase()) <
                    0 &&
                  creature.trait_raw
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) < 0
                ) {
                  if (
                    !creature.creature_family ||
                    creature.creature_family
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) < 0
                  )
                    push = false;
                }
              }

              if (minLevel !== "") {
                if (creature.level < minLevel) push = false;
              }

              if (maxLevel !== "") {
                if (creature.level > maxLevel) push = false;
              }

              if (push) {
                if (key === "-1") creatures.unshift(creature);
                else creatures.push(creature);
              }
            });
          }
        }
        if (data.length !== creatures.length) setData(creatures);
      });
  }, [search, minLevel, maxLevel]);

  function addOrRemoveOne(int, creature) {
    var newList = [...list];
    newList.forEach((item, index, object) => {
      if (creature.id === item.id) {
        item.count = item.count + int;
        if (item.count <= 0) {
          item.count = 1;
          if (item.type === "player") setPlayerCount(playerCount - 1);
          object.splice(index, 1);
        }
      }
    });

    setList(newList);
  }

  function changeField(event, field, creature) {
    var newList = [...list];

    newList.forEach((item) => {
      if (creature.id === item.id) {
        if (field === "notes") item[field] = event.target.value;
        else item[field] = parseInt(event.target.value);
      }
    });

    setList(newList);
  }

  function clearEnemies() {
    var newList = [];

    list.forEach((item) => {
      if (item.type === "player") {
        newList.push(item);
      }
    });

    setList(newList);
  }

  function orderByInitiative() {
    var newList = [...list];

    newList.sort(function (a, b) {
      return parseFloat(b.initiative) - parseFloat(a.initiative);
    });

    setList(newList);
  }

  function nextTurn() {
    if (list.length > 0) {
      var newList = [...list];

      newList.push(newList.shift());

      setList(newList);
    }
  }

  var exp = 0;

  if (playerCount > 0) {
    const difference = playerCount - 4;

    var trivial = 40 + difference * 10;
    var low = 60 + difference * 15;
    var moderate = 80 + difference * 20;
    var severe = 120 + difference * 30;
    var extreme = 160 + difference * 40;

    list.forEach((item) => {
      if (item.type !== "player") {
        const partyLevelDifference = item.adjustedLevel - playersLevel;

        if (partyLevelDifference === -4) exp += item.count * 10;
        else if (partyLevelDifference === -3) exp += item.count * 15;
        else if (partyLevelDifference === -2) exp += item.count * 20;
        else if (partyLevelDifference === -1) exp += item.count * 30;
        else if (partyLevelDifference === 0) exp += item.count * 40;
        else if (partyLevelDifference === 1) exp += item.count * 60;
        else if (partyLevelDifference === 2) exp += item.count * 80;
        else if (partyLevelDifference === 3) exp += item.count * 120;
        else if (partyLevelDifference === 4) exp += item.count * 160;
        else if (partyLevelDifference >= 5) exp += item.count * 300;
      }
    });
  }

  async function changeDifficulty(difficulty, creature) {
    var newList = [...list];

    const difficultyString = {
      1: "-w",
      2: "",
      3: "-e",
    };

    for (var item of newList) {
      if (creature.id === item.id) {
        creature.difficulty = difficulty;

        if (difficulty === "1") {
          if (creature.adjustedLevel <= creature.level - 1) {
            creature.adjustedLevel = creature.adjustedLevel - 1;
          } else {
            creature.adjustedLevel = creature.level - 1;
          }
        } else if (difficulty === "2") {
          creature.adjustedLevel = creature.level;
        } else if (difficulty === "3") {
          if (creature.adjustedLevel >= creature.level + 1) {
            creature.adjustedLevel = creature.adjustedLevel + 1;
          } else {
            creature.adjustedLevel = creature.level + 1;
          }
        }

        const response = await fetch(
          "/creatures/" +
            creature.idHolder +
            difficultyString[difficulty] +
            ".html"
        );
        const template = await response.text();
        creature.html = template
          .replace(/<h1.*?<h1/g, "<h1")
          .replace("https://2e.aonprd.com/Images", "Images")
          .replace("Images\\NPCs", "Images\\Monsters")
          .replace("Images\\NPCs", "Images\\Monsters");

        if (creature.adjustedLevel === -2) {
          creature.adjustedLevel = -1;
          return;
        } else if (creature.adjustedLevel === 25) {
          creature.adjustedLevel = 24;
          return;
        }

        if (difficulty === "1" || difficulty === "3") {
          const levelDiff = creature.adjustedLevel - creature.level;

          if (Math.abs(levelDiff) > 1 || true) {
            const reg = /EWChange.*?<\/span>/g;
            var result;
            while ((result = reg.exec(template)) !== null) {
              let num = parseInt(
                result[0]
                  .replace('EWChange"><b>', "")
                  .replace("</b></span>", "")
              );

              if (num) {
                num = num + (levelDiff > 0 ? levelDiff - 1 : levelDiff + 1) * 2;

                creature.html = creature.html.replace(
                  result[0],
                  'EWChange changed"><b>' +
                    (result[0].indexOf("+") !== -1 ? "+" : "") +
                    num +
                    "</b></span>"
                );
              }
            }

            const hpReg = /<b>HP<\/b>.*?<\/span>/g;
            const hpResult = creature.html.match(hpReg);

            if (hpResult[0]) {
              const num = getEquivalentValueWithLevel(
                HP,
                creature.level,
                creature.hp,
                creature.adjustedLevel
              );

              creature.html = creature.html.replace(
                hpResult[0],
                '<b>HP</b> <span class="EWChange changed"><b>' +
                  num +
                  "</b></span>"
              );
            }

            const percRegex = /<b>Perception<\/b>.*?<\/span>/g;
            const percResult = creature.html.match(percRegex);

            if (percResult[0]) {
              var num = getEquivalentValueWithLevel(
                perception,
                creature.level,
                creature.perception,
                creature.adjustedLevel
              );
              if (
                creature.html.indexOf(
                  '<b>Perception</b> +<span class="EWChange changed"><b>'
                ) > -1
              ) {
                creature.html = creature.html.replace(
                  percResult[0],
                  '<b>Perception</b> <span class="EWChange changed"><b>' +
                    num +
                    "</b></span>"
                );
              } else {
                creature.html = creature.html.replace(
                  "Perception</b> +" + creature.perception,
                  "Perception</b> " + num
                );
              }
            }

            const acRegex = /<b>AC<\/b>.*?;/g;
            const acResult = creature.html.match(acRegex);

            if (acResult[0]) {
              const num = getEquivalentValueWithLevel(
                AC,
                creature.level,
                creature.ac,
                creature.adjustedLevel
              );
              creature.html = creature.html.replace(
                acResult[0],
                '<b>AC</b> <span class="EWChange changed"><b>' +
                  num +
                  "</b></span>;"
              );
            }

            const fortRegex = /<b>Fort<\/b>.*?<\/span>/g;
            const fortResult = creature.html.match(fortRegex);

            if (fortResult[0]) {
              const num = getEquivalentValueWithLevel(
                savingThrows,
                creature.level,
                creature.fortitude_save,
                creature.adjustedLevel
              );
              creature.html = creature.html.replace(
                fortResult[0],
                '<b>Fort</b> <span class="EWChange changed"><b>' +
                  num +
                  "</b></span>"
              );
            }

            const refRegex = /<b>Ref<\/b>.*?<\/span>/g;
            const refResult = creature.html.match(refRegex);

            if (refResult[0]) {
              const num = getEquivalentValueWithLevel(
                savingThrows,
                creature.level,
                creature.reflex_save,
                creature.adjustedLevel
              );
              creature.html = creature.html.replace(
                refResult[0],
                '<b>Ref</b> <span class="EWChange changed"><b>' +
                  num +
                  "</b></span>"
              );
            }

            const willRegex = /<b>Will<\/b>.*?<\/span>/g;
            const willResult = creature.html.match(willRegex);

            if (willResult[0]) {
              const num = getEquivalentValueWithLevel(
                savingThrows,
                creature.level,
                creature.will_save,
                creature.adjustedLevel
              );
              creature.html = creature.html.replace(
                willResult[0],
                '<b>Will</b> <span class="EWChange changed"><b>' +
                  num +
                  "</b></span>"
              );
            }

            var newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.strength,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Str</b> +" + creature.strength,
              "Str</b> " + newNum
            );

            newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.dexterity,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Dex</b> +" + creature.dexterity,
              "Dex</b> " + newNum
            );

            newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.constitution,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Con</b> +" + creature.constitution,
              "Con</b> " + newNum
            );

            newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.intelligence,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Int</b> +" + creature.intelligence,
              "Int</b> " + newNum
            );

            newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.wisdom,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Wis</b> +" + creature.wisdom,
              "Wis</b> " + newNum
            );

            newNum = getEquivalentValueWithLevel(
              abilityModifiers,
              creature.level,
              creature.charisma,
              creature.adjustedLevel
            );
            creature.html = creature.html.replace(
              "Cha</b> +" + creature.charisma,
              "Cha</b> " + newNum
            );

            const dcs = creature.html.match(
              /DC <span class="EWChange changed"><b>\d*<\/b><\/span>/g
            );

            if (dcs) {
              dcs.forEach((dc) => {
                let originalDc = dc
                  .replace('DC <span class="EWChange changed"><b>', "")
                  .replace("</b></span>", "");

                if (levelDiff > 0) {
                  originalDc = parseInt(originalDc) - 2 * Math.abs(levelDiff);
                } else {
                  originalDc = parseInt(originalDc) + 2 * Math.abs(levelDiff);
                }

                const newDc = getEquivalentValueWithLevel(
                  spells,
                  creature.level,
                  originalDc,
                  creature.adjustedLevel
                );

                creature.html = creature.html.replace(dc, "DC " + newDc);
              });
            }

            const $ = cheerio.load(creature.html);

            $(".hanging-indent").each(function (i, elem) {
              if ($(elem).html().indexOf("[") > -1) {
                var agile = false;
                if ($(elem).html().indexOf("agile") > -1) agile = true;
                var first = true;
                $(elem).html(
                  $(elem)
                    .html()
                    .replace(/\[.*?\]/g, "")
                );
                $(elem)
                  .find(".EWChange")
                  .each(function (i, elem) {
                    if (first) {
                      const strike = parseInt($(elem).text());

                      let newStrike = getEquivalentValueWithLevel(
                        strikeAttackBonus,
                        creature.level,
                        strike +
                          (levelDiff > 0 ? -2 * levelDiff : +2 * -levelDiff),
                        creature.adjustedLevel
                      );
                      let sstrike = 5;
                      let tstrike = 10;

                      if (agile) {
                        sstrike = 4;
                        tstrike = 8;
                      }

                      newStrike =
                        newStrike +
                        " [" +
                        (parseInt(newStrike - sstrike) >= 0
                          ? "+" + parseInt(newStrike - sstrike)
                          : parseInt(newStrike - sstrike)) +
                        "/" +
                        (parseInt(newStrike - tstrike) >= 0
                          ? "+" + parseInt(newStrike - tstrike)
                          : parseInt(newStrike - tstrike)) +
                        "]";

                      $(elem).before(newStrike);
                      first = false;
                    }
                  });
                $(elem).html($(elem).html().replace("++", "+"));
                $(elem).html($(elem).html().replace("+ +", "+"));
                $(elem).find(".EWChange").remove();
                const matches = $(elem)
                  .html()
                  .match(/\dd\d+\+*\d*/g);

                if (matches) {
                  matches.forEach((match) => {
                    const newNum = getEquivalentValueWithLevel(
                      strikeDamage,
                      creature.level,
                      match,
                      creature.adjustedLevel
                    );

                    if (newNum !== match)
                      $(elem).html(
                        $(elem)
                          .html()
                          .replace(match, (newNum + " ").replace("d", "ⅾ"))
                      );
                  });
                }
              } else {
                $(elem).find(".EWChange").remove();

                const matches = $(elem)
                  .html()
                  .match(/\dd\d+\+*\d*/g);

                if (matches) {
                  matches.forEach((match) => {
                    const newNum = getEquivalentValueWithLevel(
                      areaDamage,
                      creature.level,
                      match,
                      creature.adjustedLevel
                    );

                    if (newNum !== match)
                      $(elem).html(
                        $(elem)
                          .html()
                          .replace(match, (newNum + " ").replace("d", "ⅾ"))
                      );
                  });
                }
              }
            });

            creature.html = $.html();
          }
        }
      }
    }

    setList(newList);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <div className="App App-header">
          <Bar
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            setList={setList}
            list={list}
            playerName={playerName}
            setPlayerName={setPlayerName}
            playersLevel={playersLevel}
            setPlayersLevels={setPlayersLevels}
            search={search}
            setSearch={setSearch}
            minLevel={minLevel}
            setMinLevel={setMinLevel}
            maxLevel={maxLevel}
            setMaxLevel={setMaxLevel}
          />
          <div style={{ margin: 20 }}>
            <Dialog
              open={openPopUp !== false}
              onClose={() => {
                changeField({ target: { value: notes } }, "notes", openPopUp);
                setOpenPopUp(false);
              }}
            >
              <TextField
                style={{ minWidth: 500, margin: 20 }}
                id="outlined-basic"
                label="Notes"
                variant="outlined"
                rows={12}
                multiline
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              />
            </Dialog>
            <Table
              showTable={showTable}
              setShowTable={setShowTable}
              rows={data}
              list={list}
              setList={setList}
            />

            <Paper className="toolbar" style={{ marginTop: 10 }}>
              <Button
                onClick={() => {
                  nextTurn();
                }}
              >
                Next turn
              </Button>{" "}
              {playerCount > 0 && (
                <>
                  <span>XP: {exp}</span> <span>-</span>{" "}
                  <span
                    style={{
                      color: "lightgreen",
                      fontWeight:
                        exp >= trivial && exp < low ? "bold" : "normal",
                      textDecoration:
                        exp >= trivial && exp < low ? "underline" : "none",
                    }}
                  >
                    Trivial {trivial}XP
                  </span>{" "}
                  <span
                    style={{
                      color: "green",
                      fontWeight:
                        exp >= low && exp < moderate ? "bold" : "normal",
                      textDecoration:
                        exp >= low && exp < moderate ? "underline" : "none",
                    }}
                  >
                    Low {low}XP
                  </span>{" "}
                  <span
                    style={{
                      color: "yellow",
                      fontWeight:
                        exp >= moderate && exp < severe ? "bold" : "normal",
                      textDecoration:
                        exp >= moderate && exp < severe ? "underline" : "none",
                    }}
                  >
                    Moderate {moderate}XP
                  </span>{" "}
                  <span
                    style={{
                      color: "orange",
                      fontWeight:
                        exp >= severe && exp < extreme ? "bold" : "normal",
                      textDecoration:
                        exp >= severe && exp < extreme ? "underline" : "none",
                    }}
                  >
                    Severe {severe}XP
                  </span>{" "}
                  <span
                    style={{
                      color: "red",
                      fontWeight: exp >= extreme ? "bold" : "normal",
                      textDecoration: exp >= extreme ? "underline" : "none",
                    }}
                  >
                    Extreme {extreme}XP
                  </span>
                </>
              )}{" "}
              <Button
                onClick={() => {
                  setList([]);
                  setPlayerCount(0);
                }}
                style={{ float: "right" }}
              >
                Clear
              </Button>{" "}
              <Button
                onClick={() => {
                  clearEnemies();
                }}
                style={{ float: "right" }}
              >
                Clear enemies
              </Button>{" "}
              <Button
                onClick={() => {
                  orderByInitiative();
                }}
                style={{ float: "right" }}
              >
                Order{" "}
                <span className="hideresponsive" style={{ marginLeft: 5 }}>
                  by Initiative
                </span>
              </Button>
            </Paper>

            {list.map((item) => {
              const hp = [];

              for (var i = 0; i < item.count; i++) {
                hp.push(
                  <TextField
                    defaultValue={item.hp}
                    style={{ textAlign: "center", width: 75, marginRight: 10 }}
                    id="input-with-sx"
                    label={"HP" + (i + 1)}
                    variant="standard"
                  />
                );
              }
              return (
                <Paper
                  className="creature"
                  key={item.id}
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    padding: 15,
                    marginTop: 10,
                    marginBottom: 10,
                    width: "100%",
                    overflow: "hidden",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div>
                    {item.type !== "player" && (
                      <>
                        <IconButton
                          onClick={() => {
                            addOrRemoveOne(+1, item);
                          }}
                          color="primary"
                          component="label"
                        >
                          <AddBox />
                        </IconButton>
                        <p>{item.count}</p>
                        <IconButton
                          onClick={() => {
                            addOrRemoveOne(-1, item);
                          }}
                          color="primary"
                          component="label"
                        >
                          <IndeterminateCheckBox />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      onClick={() => {
                        addOrRemoveOne(-100000, item);
                      }}
                      color="secondary"
                      component="label"
                    >
                      <DisabledByDefault />
                    </IconButton>
                    <Button
                      onClick={() => {
                        var newOpened = [...opened];
                        var push = true;
                        newOpened.forEach((opened, index, object) => {
                          if (opened === item.id) {
                            object.splice(index, 1);
                            push = false;
                          }
                        });

                        if (push) newOpened.push(item.id);

                        setOpened(newOpened);
                      }}
                    >
                      {item.name}
                      {item.type === "player" ? "  " : ""}
                    </Button>
                    <Button
                      variant={"outlined"}
                      style={{
                        marginLeft: 10,
                        fontSize: 10,
                      }}
                      className={item.notes ? "notesButtonTrue" : "notesButton"}
                      color={"secondary"}
                      onClick={() => {
                        setNotes(item.notes);
                        setOpenPopUp(item);
                      }}
                    >
                      Notes
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    {item.type !== "player" && (
                      <div
                        style={{
                          marginRight: 60,
                          textAlign: "center",
                          display: "flex",
                        }}
                        className="hideresponsive"
                      >
                        <Button
                          onClick={() => {
                            changeDifficulty("1", item);
                          }}
                          variant={
                            item.difficulty === "1" ? "contained" : "outlined"
                          }
                          style={{ marginLeft: 10 }}
                        >
                          -1
                        </Button>
                        <Button
                          onClick={() => {
                            changeDifficulty("2", item);
                          }}
                          variant={
                            item.difficulty === "2" ? "contained" : "outlined"
                          }
                          style={{ marginLeft: 10 }}
                        >
                          0
                        </Button>
                        <Button
                          onClick={() => {
                            changeDifficulty("3", item);
                          }}
                          variant={
                            item.difficulty === "3" ? "contained" : "outlined"
                          }
                          style={{ marginLeft: 10 }}
                        >
                          +1
                        </Button>
                      </div>
                    )}
                    {hp}
                    <TextField
                      onChange={(event) => {
                        changeField(event, "ac", item);
                      }}
                      defaultValue={item.ac}
                      style={{ marginLeft: 12, textAlign: "center", width: 24 }}
                      id="input-with-sx"
                      label="AC"
                      variant="standard"
                    />
                    <TextField
                      onChange={(event) => {
                        changeField(event, "initiative", item);
                      }}
                      defaultValue={item.initiative}
                      style={{
                        marginLeft: 12,
                        marginRight: 100,
                        textAlign: "center",
                        width: 24,
                      }}
                      id="input-with-sx"
                      label="Init"
                      variant="standard"
                    />
                    <span className="hideresponsive">
                      Lv.{" "}
                      {item.type === "player"
                        ? playersLevel
                        : item.adjustedLevel}
                    </span>
                  </div>
                  {opened.indexOf(item.id) >= 0 && (
                    <div
                      className="htmlmonster"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                      style={{ width: "100%" }}
                    ></div>
                  )}
                </Paper>
              );
            })}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
