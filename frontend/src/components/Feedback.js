import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import { submitFeedback } from '../api';

const Feedback = ({ user }) => {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!message.trim()) {
            setError('Feedback message cannot be empty.');
            return;
        }
        try {
            const response = await submitFeedback({ message });
            if (response?.feedback) {
                setSuccess('Feedback submitted successfully!');
                setMessage('');
            } else {
                throw new Error('Unexpected response from server.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit feedback.');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Feedback
            </Typography>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter your feedback here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#000000',
                    color: 'white',
                    ml: 23,
                    '&:hover': {
                        backgroundColor: '#333333',
                    },
                }}
                onClick={handleSubmit}
            >
                Submit Feedback
            </Button>
        </Container>
    );
};

export default Feedback;