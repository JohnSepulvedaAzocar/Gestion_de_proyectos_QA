'use client';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./page.module.css";
import TextField from '@mui/material/TextField';
import TableState from '../components/TableState';

export default function EstadoReq() {
  const [showTable, setshowTable] = useState(false);

  return (
    <main className={styles.main}>
      <Typography variant="h3" component="h3">
        Estado de Requerimientos
      </Typography>
      <div className={styles.searchContainer}>
      <TextField
  hiddenLabel
  id="filled-hidden-label-normal"
  variant="filled"
/><Button variant="outlined" onClick={()=> setshowTable(true)}>Buscar</Button>
</div>
{showTable && <TableState/>}

    </main>
  );
}
