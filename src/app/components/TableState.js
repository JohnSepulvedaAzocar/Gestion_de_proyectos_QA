import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const rows = [
  { id: 1, cases: 3, ejec:1,pend: 2,fail:1, final:1 },
  { id: 2, cases: 3, ejec:2,pend: 1,fail:2, final:2 },
  { id: 3, cases: 3, ejec:3,pend: 0,fail:0, final:3 },
];

const TableState = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Iteracion</TableCell>
            <TableCell>Casos</TableCell>
            <TableCell>Ejecutados</TableCell>
            <TableCell>Pendientes</TableCell>
            <TableCell>Fallidos</TableCell>
            <TableCell>Finalizado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.cases}</TableCell>
              <TableCell>{row.ejec}</TableCell>
              <TableCell>{row.pend}</TableCell>
              <TableCell>{row.fail}</TableCell>
              <TableCell>{row.final}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableState;
