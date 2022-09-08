import './App.css';
import * as React from 'react';
import { useState } from 'react';
import Bar from "./components/bar";
import Table from "./components/table";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { AddBox, IndeterminateCheckBox, DisabledByDefault } from '@mui/icons-material';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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

  React.useEffect(() => {
    const oldList = JSON.parse(localStorage.getItem('list'));

    if (oldList) {
      setList(oldList);
     }

     const oldminlevel = JSON.parse(localStorage.getItem('minLevel'));

    if (oldminlevel) {
      setMinLevel(oldminlevel);
     }

     const oldmaxlevel = JSON.parse(localStorage.getItem('maxLevel'));

    if (oldmaxlevel) {
      setMaxLevel(oldmaxlevel);
     }

     const oldplayerslevel = JSON.parse(localStorage.getItem('playersLevel'));
    if (oldplayerslevel) {
      setPlayersLevels(oldplayerslevel);
     }

     const oldplayercount = JSON.parse(localStorage.getItem('playerCount'));

    if (oldplayercount) {
      setPlayerCount(oldplayercount);
     }

     setIsInitializing(false);
    
  }, []);

  React.useEffect(() => {
    if(isInitializing === false)
    {
      localStorage.setItem("list", JSON.stringify(list));
    }
    
  }, [list, isInitializing])

  React.useEffect(() => {
    if(isInitializing === false)
    {
      localStorage.setItem("minLevel", JSON.stringify(minLevel));
      localStorage.setItem("maxLevel", JSON.stringify(maxLevel));
    }
  }, [minLevel, maxLevel, isInitializing])

  React.useEffect(() => {
    if(isInitializing === false)
    {
      localStorage.setItem("playersLevel", JSON.stringify(playersLevel));
    }
  }, [playersLevel, isInitializing])

  React.useEffect(() => {
    if(isInitializing === false)
    {
    localStorage.setItem("playerCount", JSON.stringify(playerCount));
    }
  }, [playerCount, isInitializing])

  React.useEffect(() => {
    fetch("./list.json")
    .then(res => res.json())
    .then(json => {

      const creatures = [];

      for(const key of Object.keys(json) )
      {
        var array = [];
        
        array = json[key];

        if(array)
        {
          array.forEach(async creature => {
            creature.trait_raw = creature.trait_raw.join(", ");
            
            var push = true;
            if(search !== "")
            {
              if(creature.name.toLowerCase().indexOf(search.toLowerCase()) < 0 && creature.trait_raw.toLowerCase().indexOf(search.toLowerCase()) < 0)
                push = false;
            }

            if(minLevel !== "")
            {
              if(creature.level < minLevel)
                push = false;
            }

            if(maxLevel !== "")
            {
              if(creature.level > maxLevel)
                push = false;
            }

            if(push)
            {
              if(key === "-1")
                creatures.unshift(creature);
              else
                creatures.push(creature);
            }
            
          })
        }
      }
      if(data.length !== creatures.length)
        setData(creatures)

    });
  }, [search, minLevel, maxLevel]);

  function addOrRemoveOne(int, creature)
  {
    var newList = [...list];
    newList.forEach((item, index, object) => {
      if(creature.id === item.id)
      {
        item.count = item.count + int;
        if(item.count <= 0)
        {
          item.count = 1;
          if(item.type === "player")
            setPlayerCount(playerCount - 1);
          object.splice(index, 1);
        }
      }
      
    })

    setList(newList);
    
  }

  function changeField(event, field, creature)
  {
    var newList = [...list];

    newList.forEach((item) => {
      if(creature.id === item.id)
      {
        item[field] = parseInt(event.target.value);
      }
      
    })

    setList(newList);
  }

  function clearEnemies()
  {
    var newList = [];

    list.forEach((item) => {
      if(item.type === "player")
      {
        newList.push(item);
      }
      
    })

    setList(newList);

  }

  function orderByInitiative()
  {
    var newList = [...list];

    newList.sort(function(a, b) {
        return parseFloat(b.initiative) - parseFloat(a.initiative);
    });

    setList(newList);
  }

  function nextTurn()
  {
    var newList = [...list];

    newList.push(newList.shift());

    setList(newList);
  }

  var exp = 0;

  if(playerCount > 0)
  {
    const difference = playerCount - 4;

    var trivial = 40 + difference * 10;
    var low = 60 + difference * 15;
    var moderate = 80 + difference * 20;
    var severe = 120 + difference * 30;
    var extreme = 160 + difference * 40;

    list.forEach((item) => {
      if(item.type !== 'player')
      {
        const partyLevelDifference = item.adjustedLevel - playersLevel;

        if(partyLevelDifference === -4)
          exp += item.count * 10;
        else if(partyLevelDifference === -3)
          exp += item.count * 15;
        else if(partyLevelDifference === -2)
          exp += item.count * 20;
        else if(partyLevelDifference === -1)
          exp += item.count * 30;
        else if(partyLevelDifference === 0)
          exp += item.count * 40;
        else if(partyLevelDifference === 1)
          exp += item.count * 60;
        else if(partyLevelDifference === 2)
          exp += item.count * 80;
        else if(partyLevelDifference === 3)
          exp += item.count * 120;
        else if(partyLevelDifference >= 4)
          exp += item.count * 160;

      }

    })
  }

  async function changeDifficulty(difficulty, creature)
  {
    var newList = [...list];

    const difficultyString = {
      "1": "-w",
      "2":"",
      "3":"-e"
    }

    for (var item of newList)
    {
      if(creature.id === item.id)
      {
        
        creature.difficulty = difficulty;

        if(difficulty === "1")
          creature.adjustedLevel = creature.level -1;
        else if(difficulty === "2")
          creature.adjustedLevel = creature.level;
        else if(difficulty === "3")
          creature.adjustedLevel = creature.level +1;

        const response = await fetch('/creatures/'+creature.idHolder+difficultyString[difficulty]+".html");
        const template = await response.text();
        creature.html = template.replace(/<h1.*?<h1/g, "<h1");
          
      }

    }


    setList(newList);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
          <div className="App App-header">
          <Bar playerCount={playerCount} setPlayerCount={setPlayerCount} setList={setList} list={list} playerName={playerName} setPlayerName={setPlayerName} playersLevel={playersLevel} setPlayersLevels={setPlayersLevels} search={search} setSearch={setSearch} minLevel={minLevel} setMinLevel={setMinLevel} maxLevel={maxLevel} setMaxLevel={setMaxLevel}/>
          <div style={{margin:20}}>
            <Table rows={data} list={list} setList={setList} />

            <Paper className="toolbar" style={{marginTop:10}}><Button onClick={() => {nextTurn()}}>Next turn</Button> {playerCount > 0 && <><span>XP: {exp}</span> <span>-</span> <span style={{color:"lightgreen", fontWeight: (exp >= trivial && exp < low) ? "bold" : "normal", textDecoration: (exp >= trivial && exp < low) ? "underline" : "none"}}>Trivial {trivial}XP</span> <span style={{color:"green", fontWeight: exp >= low && exp < moderate ? "bold" : "normal", textDecoration: exp >= low && exp < moderate ? "underline" : "none"}}>Low {low}XP</span> <span style={{color:"yellow", fontWeight: exp >= moderate && exp < severe ? "bold" : "normal", textDecoration: exp >= moderate && exp < severe ? "underline" : "none"}}>Moderate {moderate}XP</span> <span style={{color:"orange", fontWeight: exp >= severe && exp < extreme ? "bold" : "normal", textDecoration: exp >= severe && exp < extreme ? "underline" : "none"}}>Severe {severe}XP</span> <span style={{color:"red", fontWeight: exp >= extreme ? "bold" : "normal", textDecoration: exp >= extreme ? "underline" : "none"}}>Extreme {extreme}XP</span></>} <Button onClick={() => {setList([]); setPlayerCount(0);}} style={{float:"right"}}>Clear</Button> <Button onClick={() => {clearEnemies()}} style={{float:"right"}}>Clear enemies</Button> <Button onClick={() => {orderByInitiative()}} style={{float:"right"}}>Order by Initiative</Button> </Paper>

            {list.map((item) => {
              const hp = [];

              for(var i = 0; i < item.count; i++)
              {
                hp.push(<TextField defaultValue={item.hp} style={{ textAlign:'center', width:75, marginRight:10}} id="input-with-sx" label={"HP"+(i+1)} variant="standard" />)
              }
              return <Paper className="creature" key={item.id} style={{justifyContent:"space-between",display:"flex", padding:15, marginTop:10, marginBottom:10, width: '100%', overflow: 'hidden',flexWrap:"wrap", flexDirection:"row", alignItems:'center' }}>
                
                <div>
                  {item.type !== "player" && <>
                    <IconButton onClick={() => {addOrRemoveOne(+1, item)}} color="primary" component="label">
                      <AddBox />
                    </IconButton>
                    <p>{item.count}</p>
                    <IconButton onClick={() => {addOrRemoveOne(-1, item)}} color="primary" component="label">
                      <IndeterminateCheckBox />
                    </IconButton>
                   
                  </>}

                  <IconButton onClick={() => {addOrRemoveOne(-100000, item)}} color="secondary" component="label">
                      <DisabledByDefault />
                    </IconButton>
                  
                  <Button onClick={() => {
                    var newOpened = [...opened];
                    var push = true;
                    newOpened.forEach((opened, index, object) => {
                      if(opened === item.id)
                      {
                          object.splice(index, 1);
                          push = false;
                      }
                      
                    })
                    
                    if(push)
                      newOpened.push(item.id);

                    setOpened(newOpened);
                  }}>{item.name}{item.type === "player" ? "  " : ""}</Button>
              </div>
                <div style={{display:"flex", justifyContent:"end", alignItems:'center'}}>
                  {item.type !== "player" && 
                  <div style={{marginRight:60, textAlign:'center', display:"flex"}}>
                  <Button onClick={() => {changeDifficulty("1", item)}} variant={item.difficulty === "1" ? "contained" : "outlined"} style={{marginLeft:10}}>Weak</Button>
                  <Button onClick={() => {changeDifficulty("2", item)}} variant={item.difficulty === "2" ? "contained" : "outlined"} style={{marginLeft:10}}>Normal</Button>
                  <Button onClick={() => {changeDifficulty("3", item)}} variant={item.difficulty === "3" ? "contained" : "outlined"} style={{marginLeft:10}}>Elite</Button>
                </div>}
                  {
                    hp
                  }
                <TextField onChange={(event) => {changeField(event, "ac", item)}} defaultValue={item.ac} style={{marginLeft:12, textAlign:'center', width:24}} id="input-with-sx" label="AC" variant="standard" />
                <TextField onChange={(event) => {changeField(event, "initiative", item)}} defaultValue={item.initiative} style={{marginLeft:12, marginRight:100, textAlign:'center', width:24}} id="input-with-sx" label="Init" variant="standard" />
                Lv. {item.type === "player" ? playersLevel : item.adjustedLevel}</div>
                {opened.indexOf(item.id) >= 0 && <div className="htmlmonster" dangerouslySetInnerHTML={{ __html: item.html }}  style={{width:"100%"}}></div>}
              </Paper>;
            })}
            
          </div>
        </div>
      </main>
    </ThemeProvider>
    
  );
}

export default App;
