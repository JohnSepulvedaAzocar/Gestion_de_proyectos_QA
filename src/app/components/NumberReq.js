'use client';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
const NumberReq = ({defaultValue}) =>{
    return( 
        <TextField
          required
          id="outlined-required"
          label={defaultValue? defaultValue : "Nº Requerimiento"}
          disabled
          fullWidth
          defaultValue={defaultValue}
        />
    )
}
export default NumberReq;
