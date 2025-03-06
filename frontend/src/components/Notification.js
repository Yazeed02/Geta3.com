import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const Notification = ({ open, message, severity, onClose }) => {
  // Slide transition effect
  const transition = (props) => <Slide {...props} direction="up" />;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      TransitionComponent={transition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          borderRadius: 2,
          padding: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: '1rem',
          backgroundColor:
            severity === 'error'
              ? '#f44336'
              : severity === 'warning'
              ? '#ff9800'
              : severity === 'info'
              ? '#2196f3'
              : '#4caf50', // Different background colors for different severities
          color: '#fff',
          boxShadow: 2,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
