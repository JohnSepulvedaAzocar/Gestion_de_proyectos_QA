'use client';
import React, {useState} from 'react';
import { Button } from '@mui/material';
import styles from "./globals.module.css";
import IngresoReq from './IngresoReq';
import ModalProyectos from './ModalProyectos';


const PanelUser = () => {
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDel = () => setOpenDel(true);
  const handleCloseDel = () => setOpenDel(false);


return (
  <>
  <div className={styles.ContainerButton}>
  <Button variant="outlined" onClick={handleOpen}>Crear</Button>
  <Button variant="outlined" onClick={handleOpenDel}>Consultar</Button>
</div>
<IngresoReq open={open} handleClose={handleClose}/>
<ModalProyectos open={openDel} onClose={handleCloseDel}/>
</>
)
}

export default PanelUser;