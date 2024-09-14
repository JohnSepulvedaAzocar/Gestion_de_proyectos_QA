import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase'; 

const EditUserModal = ({ open, handleClose, userId }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [permissions, setPermissions] = useState({
    assignTasks: false,
    assignQA: false,
    setProjectDates: false,
    sendNotifications: false,
    modifyFiles: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || '');
            setPosition(data.position || '');
            setPermissions({
              assignTasks: data.assignTasks || false,
              assignQA: data.assignQA || false,
              setProjectDates: data.setProjectDates || false,
              sendNotifications: data.sendNotifications || false,
              modifyFiles: data.modifyFiles || false,
            });
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open, userId]);

  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        name,
        position,
        ...permissions,
      });
      handleClose(); 
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6">Editar Usuario</Typography>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="subtitle1">Permisos:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={permissions.assignTasks}
              onChange={handlePermissionChange}
              name="assignTasks"
            />
          }
          label="Asignación de tareas"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={permissions.assignQA}
              onChange={handlePermissionChange}
              name="assignQA"
            />
          }
          label="Asignar QA"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={permissions.setProjectDates}
              onChange={handlePermissionChange}
              name="setProjectDates"
            />
          }
          label="Fijar fechas de proyectos"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={permissions.sendNotifications}
              onChange={handlePermissionChange}
              name="sendNotifications"
            />
          }
          label="Enviar notificaciones"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={permissions.modifyFiles}
              onChange={handlePermissionChange}
              name="modifyFiles"
            />
          }
          label="Modificar archivos"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default EditUserModal;
