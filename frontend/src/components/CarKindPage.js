import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  FormGroup,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  TextField,
  FormControlLabel,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostsByCarKind } from '../api';
import Geta3Create from './Geta3Create';
import Notification from './Notification';
import carKinds from './carKinds';
import { useTranslation } from 'react-i18next';

const CarKindPage = ({ user }) => {
  const { carKind } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [carModel, setCarModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const carLogo = carKinds.find(car => car.name.toLowerCase() === carKind.toLowerCase())?.logo;

  const conditions = ['new', 'used', 'like new'];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchPostsByCarKind(carKind);
        if (response?.data) {
          const postsWithIndex = response.data.map(post => ({
            ...post,
            imgIndex: 0,
          }));
          setPosts(postsWithIndex);
          setOriginalPosts(postsWithIndex);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [carKind]);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedConditions, carModel, minPrice, maxPrice]);

  const filterPosts = () => {
    const filteredPosts = originalPosts.filter(post => {
      const matchesSearchTerm =
        post.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.carModel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondition =
        selectedConditions.length === 0 || selectedConditions.includes(post.condition);
      const matchesCarModel = !carModel || post.carModel.toLowerCase().includes(carModel.toLowerCase());
      const matchesMinPrice = minPrice === '' || post.price >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === '' || post.price <= parseFloat(maxPrice);

      return matchesSearchTerm && matchesCondition && matchesCarModel && matchesMinPrice && matchesMaxPrice;
    });
    setPosts(filteredPosts);
  };

  const handleConditionChange = condition => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const handleCreatePost = () => {
    if (!user) {
      setNotification({ open: true, message: t('loginPrompt'), severity: 'error' });
      navigate('/login');
      return;
    }
    setIsCreatePostOpen(true);
  };

  return (
    <Container sx={{ maxWidth: 'lg', padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {carLogo && (
            <img src={carLogo} alt={`${carKind} logo`} style={{ height: 50, marginRight: 10 }} />
          )}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t(`${carKind.charAt(0).toUpperCase() + carKind.slice(1)} Posts`)}
          </Typography>
        </Box>
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePost}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            {t('createPost')}
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              padding: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('filters')}
            </Typography>
            <TextField
              label={t('search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('condition')}
            </Typography>
            <FormGroup>
              {conditions.map(condition => (
                <FormControlLabel
                  key={condition}
                  control={
                    <Checkbox
                      checked={selectedConditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                    />
                  }
                  label={t(condition)}
                />
              ))}
            </FormGroup>
            <TextField
              label={t('carModel')}
              value={carModel}
              onChange={e => setCarModel(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 3, mb: 3 }}
            />
            <TextField
              label={t('minPrice')}
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label={t('maxPrice')}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {posts.length > 0 ? (
                posts.map(post => (
                  <Grid item xs={12} sm={6} md={4} key={post._id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => navigate(`/posts/${post._id}`)}
                    >
                      <CardMedia
                        component="img"
                        image={post.imgs?.[0] || '/path/to/default-placeholder.png'}
                        alt={post.Title}
                        sx={{ height: 160 }}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {post.Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {t('carModel')}: {post.carModel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('condition')}: {t(post.condition)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            fontWeight: 'bold',
                            color: 'success.main',
                          }}
                        >
                          {post.price.toLocaleString()} JOD
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                  <Typography variant="h6">{t('noResultsFound')}</Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Geta3Create open={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};

export default CarKindPage;
