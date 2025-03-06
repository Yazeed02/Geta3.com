import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { changePassword } from '../api';

const ChangePassword = ({ open, onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await changePassword({ newPassword: values.password });
        onSuccess(values.password);
        onClose();
      } catch (error) {
        const errorMessage = error.response ? error.response.data.msg : error.message;
        onError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{ onClick: (e) => e.stopPropagation() }}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Change Password
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="normal"
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="normal"
            fullWidth
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              height: 48,
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePassword;
