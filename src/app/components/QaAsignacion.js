import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography, Button } from '@mui/material';
import { firestore } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const QaAsignacion = () => {
    const [requirement, setRequirement] = useState('');
    const [qaName, setQaName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [requirements, setRequirements] = useState([]);
    const [qaNames, setQaNames] = useState([]);
    const [projectDetails, setProjectDetails] = useState(null);
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'proyectos'));
                const reqs = querySnapshot.docs.map((doc) => doc.data().numberReq);
                const notif = querySnapshot.docs.map((doc) => doc.data().notificaciones);
                setRequirements(reqs);
                setNotification(notif);
            } catch (error) {
                console.error("Error fetching requirements: ", error);
            }
        };

        fetchRequirements();
    }, []);

    useEffect(() => {
        const fetchQANames = async () => {
            try {
                const q = query(collection(firestore, 'users'), where('position', '==', 'QA'));
                const querySnapshot = await getDocs(q);
                const qas = querySnapshot.docs.map((doc) => doc.data().name);
                setQaNames(qas);
            } catch (error) {
                console.error("Error fetching QA names: ", error);
            }
        };

        fetchQANames();
    }, []);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (requirement) {
                try {
                    const projectQuery = query(collection(firestore, 'proyectos'), where('numberReq', '==', requirements));
                    const querySnapshot = await getDocs(projectQuery);
                    if (!querySnapshot.empty) {
                        const projectData = querySnapshot.docs[0].data();
                        setProjectDetails(projectData);
                        console.log(projectDetails)

                    } else {
                        setProjectDetails(null); 
                    }
                } catch (error) {
                    console.error("Error fetching project details: ", error);
                }
            } else {
                setProjectDetails(null);
            }
        };

        fetchProjectDetails();
    }, [requirement]);

    const handleRequirementChange = (event) => {
        setRequirement(event.target.value);
    };

    const handleQaNameChange = (event) => {
        setQaName(event.target.value);
    };

    const handleStartDateChange = (event) => {

        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {

        setEndDate(event.target.value);
    };

    const handleSave = async () => {
        try {
            if (requirement && qaName && startDate && endDate) {
                const q = query(collection(firestore, 'proyectos'), where('numberReq', '==', requirement));
                const splitDateEnd = endDate.split("-").join(", ");
                const splitDateStart = startDate.split("-").join(", ");

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    await updateDoc(docRef, {
                        certificadores: [{ nombre: qaName }],
                        fecha_inicio: new Date(splitDateStart),
                        fecha_fin: new Date(splitDateEnd),
                        notification: [{
                            fecha_envio: new Date(),
                            mensaje: `Se le ha asiganado el requerimiento Nº ${requirement}`,
                            usuario_destino: qaName,
                            read: false,
                            id_notificacion:`NOT-001` 
                        }]
                    });
    
                    alert('Datos guardados correctamente');
                } else {
                    alert('No se encontró un proyecto con el requerimiento especificado');
                }
            } else {
                alert('Por favor completa todos los campos');
            }
        } catch (error) {
            console.error("Error saving assignment: ", error);
            alert('Error al guardar los datos');
        }
    };
    return (
        <>
            <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} component="div">
                Asignación de Requerimientos
            </Typography>

            <div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="requirement-label">Requerimiento</InputLabel>
                            <Select
                                labelId="requirement-label"
                                value={requirement}
                                onChange={handleRequirementChange}
                            >
                                {requirements.map((req, index) => (
                                    <MenuItem key={index} value={req}>
                                        {req}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="qa-name-label">QA</InputLabel>
                            <Select
                                labelId="qa-name-label"
                                value={qaName}
                                onChange={handleQaNameChange}
                            >
                                {qaNames.map((qa, index) => (
                                    <MenuItem key={index} value={qa}>
                                        {qa}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Grid para los Inputs de Fecha en una sola línea */}
                <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                    <Grid item xs={6}>
                        <TextField
                            label="Fecha de Inicio"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Fecha de Término"
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Botón para guardar la asignación */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave} 
                    style={{ marginTop: '20px' }}
                >
                    Guardar Asignación
                </Button>

                {/* Tabla para mostrar la información */}
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Requerimiento</TableCell>
                                <TableCell>QA</TableCell>
                                <TableCell>Fecha de Inicio</TableCell>
                                <TableCell>Fecha de Término</TableCell>
                                {/* Nuevas columnas para mostrar datos del proyecto si están disponibles */}
                                {projectDetails && Object.keys(projectDetails).map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{requirement}</TableCell>
                                <TableCell>{qaName}</TableCell>
                                <TableCell>{startDate}</TableCell>
                                <TableCell>{endDate}</TableCell>
                                {/* Mostrar los valores de los detalles del proyecto */}
                                {projectDetails && Object.values(projectDetails).map((value, index) => (
                                    <TableCell key={index}>{value}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default QaAsignacion;
