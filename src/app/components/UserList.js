import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import EditUserModal from './EditUserModal'; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState({});

  // Fetch users from Firebase Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date ? data.date.toDate().toDateString() : null, // Convierte date a string
        };
      });
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    const userData = users.find(user => user.id === userId);
    setSelectedUserId(userId);
    setSelectedUserData(userData || {});
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      // Eliminar usuario de Firestore
      await deleteDoc(doc(firestore, 'users', userId));
  
      // Buscar el usuario en el estado local para obtener su UID de autenticación
      const userToDelete = users.find((user) => user.id === userId);
  
      if (userToDelete) {
        // Obtener el usuario autenticado usando el email
        const userAuth = await auth.getUserByEmail(userToDelete.email); 
  
        // Eliminar usuario de Firebase Authentication
        await deleteUser(userAuth);
        
        // Actualizar el estado para reflejar los cambios
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        
        console.log('Usuario eliminado correctamente:', userId);
      } else {
        console.error('Usuario no encontrado en el estado:', userId);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserData({});
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Icono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <EmailIcon />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditUserModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        userId={selectedUserId}
        initialData={selectedUserData}
      />
    </>
  );
};

export default UserList;