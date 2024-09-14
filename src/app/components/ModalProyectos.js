'use client'
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  List,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../lib/firebase';


const ModalProyectos = ({ open, onClose }) => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      const proyectosSnapshot = await getDocs(collection(firestore, 'proyectos'));
      const proyectosList = proyectosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      const proyectosOrdenados = proyectosList.sort((a, b) => (a.numberReq) - (b.numberReq));
  
      setProyectos(proyectosOrdenados);
    };
  
    if (open) {
      fetchProyectos();
    }
  }, [open, firestore]);
  
  const handleDeleteFile = async (projectId, file) => {
    console.log(file)
    try {

      const fileRef = ref(storage, file.fileURL);
      await deleteObject(fileRef);

      const projectRef = doc(firestore, 'proyectos', projectId);
      await updateDoc(projectRef, {
        files: proyectos.find(proj => proj.id === projectId).files.filter(archivo => archivo.file !== file.file),
      });

      setProyectos(prevProyectos =>
        prevProyectos.map(proyecto =>
          proyecto.id === projectId
            ? { ...proyecto, files: proyecto.files.filter(archivo => archivo.file !== file.file) }
            : proyecto
        )
      );
    } catch (error) {
      console.error('Error eliminando archivo:', error);
    }
  };


  const handleAddFiles = async (projectId, files) => {

    const projectRef = doc(firestore, 'proyectos', projectId);

    for (let file of files) {
      const storageRef = ref(storage, `proyectos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);


      await updateDoc(projectRef, {
        files: arrayUnion({
          file: file.name,
          fileURL: url,
        }),
      });
    }

    const updatedProyectos = await getDocs(collection(firestore, 'proyectos'));
    setProyectos(updatedProyectos.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        p: 4,
        backgroundColor: 'white',
        maxWidth: 800,
        maxHeight: 800, // Limitar la altura máxima a 800px
        overflowY: 'auto', // Habilitar el scroll vertical si el contenido sobrepasa los 800px
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centrar el modal
        boxShadow: 24,
        borderRadius: 2,
      }}>
        <Typography variant="h6" gutterBottom>Proyectos</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Archivos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proyectos.map((proyecto) => (
                <TableRow key={proyecto.id}>
                  <TableCell>{proyecto.numberReq}</TableCell>
                  <TableCell>{proyecto.comments}</TableCell>
                  <TableCell>
                    <List>
                      {proyecto.files && proyecto.files.map((archivo, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Link href={archivo.fileURL} target="_blank" rel="noopener noreferrer">
                              {archivo.file}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <IconButton edge="end" onClick={() => handleDeleteFile(proyecto.id, archivo)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      component="label"
                    >
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => handleAddFiles(proyecto.id, Array.from(e.target.files))}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={onClose} sx={{ mt: 2 }}>Cerrar</Button>
      </Box>
    </Modal>
  );
};

export default ModalProyectos;
