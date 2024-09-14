'use client'
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {formatDate} from '../helpers/functions';

const NotificationTable = ({ notifications }) => {
  console.log(notifications)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Mensaje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications?.map((notif, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(notif.fecha_envio)}</TableCell>
              <TableCell>{notif.mensaje}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NotificationTable;
