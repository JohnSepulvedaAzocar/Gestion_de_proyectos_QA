'use client';
import React, { useState, createRef } from "react";
import { Button, Typography, Paper, TextField, CircularProgress } from "@mui/material";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from '../lib/firebase';
import ReportTable from "./ReportTable";
import NotificationTable from "./NotificationTable";
import { formatDate } from '../helpers/functions';

const ReportPage = () => {
    const [reqId, setReqId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [reportData, setReportData] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setReportData(null);
        try {
            const docRef = query(
                collection(firestore, "proyectos"),
                where("numberReq", "==", reqId)
            );
            const querySnapshot = await getDocs(docRef);
            const reqs = querySnapshot.docs.map((doc) => doc.data());
            if (reqs.length > 0) {
                setReportData(reqs[0]);
            } else {
                setError("No se encontró el requerimiento.");
            }
        } catch (e) {
            alert(e);
            setError("Error al buscar el requerimiento.");
        } finally {
            setLoading(false);
        }
    };

    
    const MyDocument = () => (
        <Document>
            <Page size="A4" orientation="landscape">
                <View>
                    <Text>Reporte de requerimientos</Text>
                </View>
                <View>
                    <Text>ID: {reportData.numberReq}</Text>
                    <Text>Descripción: {reportData.comments}</Text>
                    <Text>Fecha de Inicio: {formatDate(reportData.fecha_inicio)}</Text>
                    <Text>Fecha de Término: {formatDate(reportData.fecha_fin)}</Text>
                    <Text>Iteraciones:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>Iteración</Text>
                            <Text style={styles.tableCellHeader}>Fecha de Pruebas</Text>
                            <Text style={styles.tableCellHeader}>N° Total casos</Text>
                            <Text style={styles.tableCellHeader}>N° Ejecutados</Text>
                            <Text style={styles.tableCellHeader}>N° Fallidos</Text>
                            <Text style={styles.tableCellHeader}>N° Pendientes</Text>
                            <Text style={styles.tableCellHeader}>Tasa de Error</Text>
                            <Text style={styles.tableCellHeader}>Defectos</Text>
                            <Text style={styles.tableCellHeader}>Cobertura</Text>

                        </View>
                        {reportData.iteraciones.map((iteration, index) => (
                            
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableCell}>{iteration.iteracion}</Text>
                                <Text style={styles.tableCell}>{iteration.fechaPruebas}</Text>
                                <Text style={styles.tableCell}>{iteration.numCasosProbar}</Text>
                                <Text style={styles.tableCell}>{iteration.numCasosEjecutados}</Text>
                                <Text style={styles.tableCell}>{iteration.numCasosFallidos}</Text>
                                <Text style={styles.tableCell}>{iteration.numCasosPendientes}</Text>
                                <Text style={styles.tableCell}>{Math.round(iteration.tasaError)}%</Text>
                                <Text style={styles.tableCell}>{iteration.defectos}</Text>
                                <Text style={styles.tableCell}>{Math.round(iteration.cobertura)}%</Text>
                            </View>
                        ))}
                    </View>
                    <Text>Notificaciones:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCellHeader}>#</Text>
                            <Text style={styles.tableCellHeader}>Mensaje</Text>
                            <Text style={styles.tableCellHeader}>Fecha</Text>
                        </View>
                        {reportData.notification.map((notification, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={styles.tableCell}>{notification.mensaje}</Text>
                                <Text style={styles.tableCell}>{formatDate(notification.fecha_envio)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    const styles = StyleSheet.create({
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            flexDirection: "row",
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
            padding: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
        tableCellHeader: {
            margin: "auto",
            marginTop: 5,
            padding: 5,
            fontWeight: "bold",
            backgroundColor: "#f0f0f0",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
    });

    const toPdf = () => (
        <PDFDownloadLink document={<MyDocument />} fileName="reporte.pdf">
            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
        </PDFDownloadLink>
    );

    return (
        <div>
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
            {reportData && (
                <>
                    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                        <Typography variant="h5">Informe de Requerimiento</Typography>
                        <Typography variant="body1">ID: {reportData.numberReq}</Typography>
                        <Typography variant="body1">Descripción: {reportData.comments}</Typography>
                        <Typography variant="body1">Fecha de Inicio: {formatDate(reportData.fecha_inicio)}</Typography>
                        <Typography variant="body1">Fecha de Término: {formatDate(reportData.fecha_fin)}</Typography>
                        <Typography>Tabla con las iteraciones</Typography>
                        <Typography variant="h6" style={{ marginTop: "20px" }}>
                            <ReportTable iterations={reportData.iteraciones} />
                        </Typography>


                        <Typography variant="h6" style={{ marginTop: "20px" }}>
                            Tabla Notificaciones enviadas al QA
                        </Typography>
                        <NotificationTable notifications={reportData.notification} />

                    </Paper>

                    <Button variant="contained" color="primary">
                        {toPdf()}
                    </Button>
                </>
            )}

            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default ReportPage;
