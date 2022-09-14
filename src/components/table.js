import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  {
    id: 'creature_family',
    label: 'Family',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'alignment',
    label: 'Alignment',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'trait_raw',
    label: 'Traits',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'size',
    label: 'Size',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'level',
    label: 'Level',
    minWidth: 170,
    align: 'right'
  },
];

export default function StickyHeadTable({rows, list, setList, showTable, setShowTable}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Button variant="text" onClick={() => { setShowTable(!showTable); }}>{showTable ? "Hide" : "Show"} table</Button>
      {showTable && <TableContainer sx={{ maxHeight: 340 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow 
                  onClick={async () => {
                    var push = true;
                    var count = 1;
                    list.forEach((item) => {
                      if(item.idHolder === row.id)
                      {
                        count++;
                      }
                    })
                    if(push){
                      row.count = 1;
                      row.initiative = Math.floor(Math.random() * 20 + row.perception);
                      const response = await fetch('/creatures/'+row.id+".html");
                      const template = await response.text();

                      row.adjustedLevel = row.level;
                      row.difficulty = "2";
                      row.idHolder = row.id;

                      row.html = template.replace(/<h1.*?<h1/g, "<h1").replace("https://2e.aonprd.com/Images", "Images").replace("Images\\NPCs", "Images\\Monsters").replace("Images\\NPCs", "Images\\Monsters");;
                      setList([...list, {...row, id: row.id + count}]);
                    }
                      
                  }}
                  hover role="checkbox" tabIndex={-1} key={row.id} style={{cursor: "pointer"}}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>}
      
      {showTable &&
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> }
    </Paper>
  );
}
