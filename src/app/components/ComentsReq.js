import React from 'react';
import TextField from '@mui/material/TextField';

const ComentsReq = ({ onChange }) => {

  return (
    <TextField
      id="outlined-multiline-static"
      label="Comentario del Req"
      multiline
      rows={4}
      defaultValue="Escriba aqui..."
      fullWidth
      onChange={onChange}
    />
  )
}

export default ComentsReq;