import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CardUser = ({ title, number, descrip }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontSize: 14 }} component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 14 }} component="div" sx={{ fontWeight: 'bold' }}>
            {number}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 12 }} component="div" >
          {descrip}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardUser;