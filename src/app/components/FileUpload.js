import React from 'react';
import TextField from '@mui/material/TextField';

const FileUpload = ({onChange}) => {
    return (
                <TextField
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    onChange={onChange}
                />
    );
}

export default FileUpload;
