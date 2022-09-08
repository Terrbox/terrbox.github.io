import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { AddBox } from '@mui/icons-material';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '22ch',
    },
  },
}));

export default function SearchAppBar({search, setSearch, playerCount, setPlayerCount, minLevel, maxLevel, setMinLevel, setMaxLevel, playersLevel, setPlayersLevels, playerName, setPlayerName, setList, list}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h61"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            PF2e Beast
          </Typography>

          <TextField value={playerName} onChange={(event) => {setPlayerName(event.target.value)}} style={{marginLeft:12, textAlign:'center'}} id="input-with-sx" label="Player name" variant="standard" />
          <IconButton onClick={() => {
            if(playerName)
            {
              var push = true;

              list.forEach((item) => {
                if(item.id === "player-"+playerName)
                  push = false;
              })

              if(push)
              {
                setList([...list, {hp:0, initiative:0, ac:0, id:"player-"+playerName, name: playerName, level: 1, count:1, type:"player"}])
                setPlayerName("");
                setPlayerCount(playerCount +1)
              }
              
            }
            
          }} color="primary" component="label">
                    <AddBox />
          </IconButton>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Players Lv.</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="Players Lv."
          value={playersLevel}
          onChange={(event) => {setPlayersLevels(event.target.value)}}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={13}>13</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Min Lv.</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="Min Lv."
          value={minLevel}
          onChange={(event) => {setMinLevel(event.target.value)}}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={-1}>-1</MenuItem>
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={13}>13</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={21}>21</MenuItem>
          <MenuItem value={22}>22</MenuItem>
          <MenuItem value={23}>23</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Max Lv.</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="Min Lv."
          value={maxLevel}
          onChange={(event) => {setMaxLevel(event.target.value)}}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={-1}>-1</MenuItem>
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={13}>13</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={21}>21</MenuItem>
          <MenuItem value={22}>22</MenuItem>
          <MenuItem value={23}>23</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
      </FormControl>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by name or traits..."
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={(event) => {setSearch(event.target.value)}}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
