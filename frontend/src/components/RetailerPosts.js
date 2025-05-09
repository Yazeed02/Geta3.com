import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { fetchUserPosts } from '../api';

const ITEMS_PER_PAGE = 6;

const RetailerPosts = ({ userId, posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const params = useParams();
  const currentUserId = userId || params.userId;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserPosts = async () => {
      if (!initialPosts) {
        try {
          const userPosts = await fetchUserPosts(currentUserId);
          const updatedPosts = userPosts.map((post) => ({
            ...post,
            imgIndex: 0, // Ensure imgIndex is set to 0 for the first image
            Cover: post.Cover ? `http://localhost:3000/uploads/${post.Cover.split('/').pop()}` : '', // Check if Cover is defined
            imgs: post.imgs ? post.imgs.map(img => `http://localhost:3000/uploads/${img.split('/').pop()}`) : [], // Process imgs array if defined
          }));
          setPosts(updatedPosts);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserPosts();
  }, [currentUserId, initialPosts]);

  const handleShowMore = () => {
    setPage(page + 1);
  };

  const displayedPosts = posts.slice(0, page * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }} gutterBottom>
        Retailer Posts
      </Typography>
      <Grid container spacing={3}>
        {displayedPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Box
              onClick={() => navigate(`/posts/${post._id}`)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    post.imgs && post.imgs.length > 0
                      ? post.imgs[0] // Use the first image if available
                      : post.Cover // Fallback to Cover
                      ? post.Cover // If Cover is available
                      : '/path/to/default/image.jpg' // Use a default placeholder image if no images are available
                  }
                  alt={post.Title}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: theme.palette.text.primary,
                      fontSize: '1.1rem',
                      lineHeight: '1.5',
                    }}
                  >
                    {post.Title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
                    {post.Description.length > 100 ? `${post.Description.substring(0, 100)}...` : post.Description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1, fontSize: '0.9rem' }}>
                    Condition: <strong>{post.condition}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
                    Model: <strong>{post.carModel}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      {posts.length > displayedPosts.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            sx={{
              borderRadius: 1.5,
              padding: '10px 30px',
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
            onClick={handleShowMore}
          >
            Show More
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RetailerPosts;
