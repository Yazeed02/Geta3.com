import React, { useEffect, useState } from 'react';
import { fetchItemsToApprove, approveItem, unAuthorizeItem, fetchFeedback } from '../api';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [itemsToApprove, setItemsToApprove] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchItemsToApprove();
        setItemsToApprove(data.Geta3s);
      } catch (err) {
        setError('Failed to fetch items to approve.');
      }
    };

    const loadFeedbacks = async () => {
      try {
        const feedbackData = await fetchFeedback();
        setFeedbacks(feedbackData);
      } catch (err) {
        setError('Failed to load feedback.');
      }
    };

    fetchData();
    loadFeedbacks();
  }, []);

  const handleApprove = async (itemId) => {
    try {
      await approveItem(itemId);
      setItemsToApprove(itemsToApprove.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Failed to approve item.');
    }
  };

  const handleUnAuthorize = async (itemId) => {
    try {
      await unAuthorizeItem(itemId);
      setItemsToApprove(itemsToApprove.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Failed to un-authorize item.');
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t('adminPanel')}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Paper elevation={3} sx={{ mt: 2, mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Items to Approve" />
          <Tab label="Feedback" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <Box>
          {itemsToApprove.length === 0 ? (
            <Typography variant="h6">No items to approve.</Typography>
          ) : (
            <Grid container spacing={3}>
              {itemsToApprove.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{item.Title}</Typography>
                      <Typography variant="body2">{item.Description}</Typography>
                      <Typography variant="body2">Condition: {item.condition}</Typography>
                      <Typography variant="body2">Car Type: {item.carType}</Typography>
                      <Typography variant="body2">Car Model: {item.carModel}</Typography>
                      {item.Related_link && (
                        <Typography variant="body2">
                          <a href={item.Related_link} target="_blank" rel="noopener noreferrer">
                            Related Link
                          </a>
                        </Typography>
                      )}
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button
                          onClick={() => handleApprove(item._id)}
                          variant="contained"
                          color="primary"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleUnAuthorize(item._id)}
                          variant="contained"
                          color="secondary"
                        >
                          UnAuthorize
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          {feedbacks.length === 0 ? (
            <Typography variant="h6">No feedback available.</Typography>
          ) : (
            feedbacks.map((fb) => (
              <Card key={fb._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{fb.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    From: {fb.user.FirstName} {fb.user.LastName} ({fb.user.Email})
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Container>
  );
};

export default AdminPanel;
