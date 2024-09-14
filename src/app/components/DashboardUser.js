'use client';
import React, { useState, useEffect } from 'react';
import CardUser from './CardUser';
import PanelUser from './PanelUser';
import QaAsignacion from './QaAsignacion';
import styles from "./globals.module.css";
import GraficoEvidencia from './GraficoEvidencia';
import { Typography } from '@mui/material';
import { firestore } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';


const DashboardUser = () => {
    const [fecha, setFecha] = useState("");
    const [req, setReq] = useState("");
    const [users, setUsers] = useState("");


    useEffect(() => {
        countDocumentsInCollection();
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = hoy.toLocaleDateString("es-ES", opciones);
        const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

        setFecha(fechaCapitalizada);
    }, []);
    
    const countDocumentsInCollection = async () => {
        try {
        const collectionRef = collection(firestore, 'proyectos');
        const collectionUsers = collection(firestore, 'users');

        const querySnapshot = await getDocs(collectionRef);
        const querySnapshotUsers = await getDocs(collectionUsers);

        const documentCount = querySnapshot.size;
        const documentCountUsers = querySnapshotUsers.size;
      
        setReq(documentCount);
        setUsers(documentCountUsers);
        } catch (error) {
          console.error("Error al contar los documentos: ", error);
          return 0;
        }
      };

    return (
        <div className={styles.Container}>
            <div className={styles.DashboardContainer}>

                <div>
                    <Typography sx={{ fontSize: 16 }} component="div" sx={{ fontWeight: 'bold' }}>
                        {fecha}
                    </Typography>
                    <PanelUser />
                </div>
                <div className={styles.CardContainer}>
                    <CardUser title="USUARIOS REGISTRADOS" number={users} />
                    <CardUser title="REQUERIMIENTOS" number={req} descrip="Nuevos requerimientos ingresados" />
                </div>

            </div>
            <div className={styles.GraficoContainer}>
            <Typography sx={{ fontSize: 16 }} component="div" sx={{ fontWeight: 'bold' }}>
                Grafico de Requerimientos
            </Typography>
<GraficoEvidencia /></div>
            <QaAsignacion/>
        </div>
    )
}

export default DashboardUser;