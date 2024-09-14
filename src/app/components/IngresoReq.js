import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { firestore, storage } from '../lib/firebase'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from "./globals.module.css";
import NumberReq from './NumberReq';
import ComentsReq from './ComentsReq';
import FileUpload from './FileUpload';
// import {generarNumeroAleatorio} from '../helpers/functions';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function IngresoReq({open, handleClose}) {
  const [numberReq, setNumberReq] = useState(''); 
  const [comments, setComments] = useState(''); 
  const [file, setFile] = useState(null); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');

  const getNextIncrementalNumbrer = async () => {
    try {
      const collectionRef = collection(firestore, 'proyectos');
      const snapshot = await getDocs(collectionRef);
      
      const count = snapshot.size;
  
      const nextNumber = count + 1;
  
      const nextIncremental = `Req000${nextNumber}`;
      setNumberReq(nextIncremental)
    } catch (error) {
      console.error("Error al obtener el número incremental: ", error);
      return null;
    }

  }


  useEffect(() => {
      getNextIncrementalNumbrer();
}, []);



  function handleUpload() {
    if (!file) return;

    const storageRef = ref(storage, `proyectos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(firestore, "proyectos"), {
        numberReq,
        comments,
        files:[ {
          file: file ? file.name : null,
          fileURL: downloadURL,
        }]
      });
      console.log("Documento agregado con ID: ", docRef.id);
      handleClose();
    } catch (e) {
      console.error("Error al agregar el documento: ", e);
    }
  };

  return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className={styles.ModalContainer}>
          <Typography variant="h6" component="h2">
            Formulario de Requerimientos
          </Typography>
          <NumberReq defaultValue={numberReq} />
          <ComentsReq value={comments} onChange={(e) => setComments(e.target.value)}
          />
          <FileUpload onChange={(e) => setFile(e.target.files[0])} />
            <div>
          <Button variant="outlined" fullWidth onClick={handleUpload}>
            Subir Archivo
          </Button>
          <div>Upload Progress: {uploadProgress}%</div>
          </div>
          <Button variant="outlined" disabled={!downloadURL} fullWidth onClick={handleSave}>
            Guardar
          </Button>
          </div>
        </Box>
      </Modal>
  );
}
