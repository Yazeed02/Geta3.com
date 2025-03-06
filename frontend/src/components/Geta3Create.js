import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createGeta3 } from '../api';
import Notification from './Notification';
import { useTranslation } from 'react-i18next';

const carTypes = [
  'AlfaRomeo', 'Audi', 'BMW', 'BYD', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Dodge',
  'Fiat', 'Ford', 'GAC', 'GMC', 'Haval', 'Honda', 'Hyundai', 'Isuzu', 'Jeep', 'KIA', 'Land Rover',
  'Lexus', 'Mazda', 'Mercedes', 'MG', 'Mitsubishi', 'Nissan', 'Peugeot', 'Porsche', 'Renault',
  'Skoda', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'VW', 'Other',
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: { xs: '90%', sm: '70%', md: '60%', lg: '50%', xl: '40%' },
  maxHeight: '90vh',
  overflowY: 'auto',
};

const Geta3Create = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [imgPreviews, setImgPreviews] = useState([]);

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      relatedLink: '',
      condition: '',
      carType: '',
      customCarType: '',
      carModel: '',
      carManufacturingYear: '',
      price: '',
      imgs: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required(t('requiredField')),
      description: Yup.string().required(t('requiredField')),
      condition: Yup.string().required(t('requiredField')),
      carType: Yup.string().required(t('requiredField')),
      carModel: Yup.string().required(t('requiredField')),
      carManufacturingYear: Yup.number()
        .typeError(t('numberRequired'))
        .required(t('requiredField')),
      price: Yup.number()
        .typeError(t('numberRequired'))
        .required(t('requiredField')),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'imgs') {
          value.forEach((file) => formData.append('img', file));
        } else {
          formData.append(key, value);
        }
      });

      try {
        setLoading(true);
        await createGeta3(formData);
        setNotification({ open: true, message: t('postCreatedSuccess'), severity: 'success' });
        onClose();
      } catch (error) {
        setNotification({ open: true, message: t('postCreateFail'), severity: 'error' });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setNotification({ open: true, message: t('fileSizeLimit'), severity: 'error' });
        return false;
      } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setNotification({ open: true, message: t('supportedFormats'), severity: 'error' });
        return false;
      }
      return true;
    });

    formik.setFieldValue('imgs', validFiles);
    const filePreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImgPreviews(filePreviews);
  };

  const handleRemoveImage = (index) => {
    const newImgs = formik.values.imgs.filter((_, i) => i !== index);
    const newImgPreviews = imgPreviews.filter((_, i) => i !== index);
    formik.setFieldValue('imgs', newImgs);
    setImgPreviews(newImgPreviews);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{t('createPost')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label={t('title')}
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
            error={Boolean(formik.errors.title)}
            helperText={formik.errors.title}
          />
          <TextField
            label={t('description')}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={4}
            error={Boolean(formik.errors.description)}
            helperText={formik.errors.description}
          />
          <TextField
            label={t('relatedLink')}
            name="relatedLink"
            value={formik.values.relatedLink}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.errors.condition)}>
            <InputLabel>{t('condition')}</InputLabel>
            <Select
              name="condition"
              value={formik.values.condition}
              onChange={formik.handleChange}
            >
              <MenuItem value="new">{t('new')}</MenuItem>
              <MenuItem value="used">{t('used')}</MenuItem>
              <MenuItem value="like new">{t('likeNew')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.errors.carType)}>
            <InputLabel>{t('selectCarType')}</InputLabel>
            <Select
              name="carType"
              value={formik.values.carType}
              onChange={formik.handleChange}
            >
              {carTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formik.values.carType === 'Other' && (
            <TextField
              label={t('customCarType')}
              name="customCarType"
              value={formik.values.customCarType}
              onChange={formik.handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label={t('carModel')}
            name="carModel"
            value={formik.values.carModel}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
            error={Boolean(formik.errors.carModel)}
            helperText={formik.errors.carModel}
          />
          <TextField
            label={t('carManufacturingYear')}
            name="carManufacturingYear"
            value={formik.values.carManufacturingYear}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
            error={Boolean(formik.errors.carManufacturingYear)}
            helperText={formik.errors.carManufacturingYear}
          />
          <TextField
            label={t('price')}
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            fullWidth
            sx={{ mb: 2 }}
            type="number"
            error={Boolean(formik.errors.price)}
            helperText={formik.errors.price}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            {t('uploadImages')}
            <input
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
            />
          </Button>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {imgPreviews.map((src, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box position="relative">
                  <img src={src} alt={`Preview ${index + 1}`} style={{ width: '100%' }} />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('submit')}
          </Button>
        </form>

        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={handleNotificationClose}
        />
      </Box>
    </Modal>
  );
};

export default Geta3Create;
