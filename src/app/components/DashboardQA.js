'use client';
import React, { useState } from "react";
import {
    Container, TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, CircularProgress, Grid
} from "@mui/material";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from '../lib/firebase';

const DashboardQA = () => {
    const [reqId, setReqId] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [inicio, setInicio] = useState(null);
    const [termino, setTermino] = useState(null);

    const [formData, setFormData] = useState({
        iteracion: "",
        fechaPruebas: "",
        numCasosProbar: "",
        numCasosEjecutados: "",
        numCasosFallidos: "",
        numCasosPendientes: "",
        tasaError: "",
        defectos: "",
        cobertura: ""
    });

    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setData([]);
        try {
            const docRef = query(
                collection(firestore, "proyectos"),
                where("numberReq", "==", reqId)
            );
            const querySnapshot = await getDocs(docRef);
            const reqs = querySnapshot.docs.map((doc) => doc.data());
            if (reqs.length > 0) {
                setData(reqs[0].iteraciones);

                // Convertir timestamp a formato de fecha 'YYYY-MM-DD'
                const fechaInicio = new Date(reqs[0].fecha_inicio.seconds * 1000).toISOString().split('T')[0];
                const fechaTermino = new Date(reqs[0].fecha_fin.seconds * 1000).toISOString().split('T')[0];

                setInicio(fechaInicio);
                setTermino(fechaTermino);
            } else {
                setError("No se encontró el requerimiento.");
            }
        } catch (e) {
            setError("Error al buscar el requerimiento.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        console.log(typeof formData.numCasosProbar)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            tasaError: (+formData.numCasosFallidos * 100) / +formData.numCasosProbar,
            cobertura: ((+formData.numCasosEjecutados + +formData.numCasosFallidos)*100) / +formData.numCasosProbar,
            numCasosPendientes: (+formData.numCasosProbar - (+formData.numCasosEjecutados + +formData.numCasosFallidos))
        });
    };

    const handleSave = async () => {
        try {
            if (
                reqId &&
                formData.iteracion !== '' &&
                formData.fechaPruebas !== '' &&
                formData.numCasosProbar !== '' &&
                formData.numCasosEjecutados !== '' &&
                formData.numCasosFallidos !== ''
            ) {
                const q = query(collection(firestore, 'proyectos'), where('numberReq', '==', reqId));

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    const docData = querySnapshot.docs[0].data();

                    const iteracionesExistentes = docData.iteraciones || [];

                    const nuevasIteraciones = [...iteracionesExistentes, { ...formData }];

                    await updateDoc(docRef, {
                        iteraciones: nuevasIteraciones
                    });

                    alert('Datos guardados correctamente');
                    setFormData({
                        iteracion: "",
                        fechaPruebas: "",
                        numCasosProbar: "",
                        numCasosEjecutados: "",
                        numCasosFallidos: "",
                        numCasosPendientes: "",
                        tasaError: "",
                        defectos: "",
                        cobertura: ""
                    });

                    handleSearch();
                } else {
                    alert('No se encontró un proyecto con el requerimiento especificado');
                }
            } else {
                alert('Por favor completa todos los campos');
            }
        } catch (error) {
            console.error("Error al guardar los datos: ", error);
            alert('Error al guardar los datos');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Buscar Requerimiento</Typography>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <TextField
                    label="ID Requerimiento"
                    variant="outlined"
                    value={reqId}
                    onChange={(e) => setReqId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Buscar
                </Button>
            </form>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>Formulario registro de Certificación</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Iteración"
                        name="iteracion"
                        variant="outlined"
                        value={formData.iteracion}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Fecha de Pruebas"
                        type="date"
                        name="fechaPruebas"
                        variant="outlined"
                        value={formData.fechaPruebas}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: inicio, 
                            max: termino,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="N° Casos a Probar"
                        name="numCasosProbar"
                        variant="outlined"
                        value={formData.numCasosProbar}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="N° Casos Ejecutados"
                        name="numCasosEjecutados"
                        variant="outlined"
                        value={formData.numCasosEjecutados}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="N° Casos Fallidos"
                        name="numCasosFallidos"
                        variant="outlined"
                        value={formData.numCasosFallidos}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Defectos"
                        name="defectos"
                        variant="outlined"
                        value={formData.defectos}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                fullWidth
                style={{ marginTop: 20 }}
            >
                Guardar
            </Button>

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
                        {data?.map((row, index) => (
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
        </Container>
    );
};

export default DashboardQA;
