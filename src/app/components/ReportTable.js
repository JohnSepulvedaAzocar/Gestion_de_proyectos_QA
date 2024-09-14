'use client'
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ReportTable = ({ iterations }) => {
  console.log(iterations)
  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Iteración</TableCell>
                <TableCell>Fecha de Pruebas</TableCell>
                <TableCell>N° Total casos</TableCell>
                <TableCell>N° Ejecutados</TableCell>
                <TableCell>N° Fallidos</TableCell>
                <TableCell>N° Pendientes</TableCell>
                <TableCell>Tasa de Error</TableCell>
                <TableCell>Defectos</TableCell>
                <TableCell>Cobertura</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {iterations?.map((row, index) => (
                <TableRow key={index}>
                    <TableCell>{row.iteracion}</TableCell>
                    <TableCell>{row.fechaPruebas}</TableCell>
                    <TableCell>{row.numCasosProbar}</TableCell>
                    <TableCell>{row.numCasosEjecutados}</TableCell>
                    <TableCell>{row.numCasosFallidos}</TableCell>
                    <TableCell>{row.numCasosPendientes}</TableCell>
                    <TableCell>{Math.round(row.tasaError)}%</TableCell>
                    <TableCell>{row.defectos}</TableCell>
                    <TableCell>{Math.round(row.cobertura)}%</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>

    // <TableContainer component={Paper}>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Iteración</TableCell>
    //         <TableCell>Numero de Casos</TableCell>
    //         <TableCell>Resultado</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {iterations.map((iter, index) => (
    //         <TableRow key={index}>
    //           <TableCell>{iter.iteracion}</TableCell>
    //           <TableCell>{iter.numCasosProbar}</TableCell>
    //           <TableCell>{iter.result}</TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
};

export default ReportTable;
