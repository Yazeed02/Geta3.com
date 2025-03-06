const Feedback = require('../models/Feedback');

const FeedbackController = {
  createFeedback: async (req, res) => {
    try {
      console.log('Feedback creation request:', req.body);

      const { message } = req.body;
      const user = req.user;

      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      if (!user || !user._id) {
        return res.status(401).json({ error: 'Unauthorized. User not found.' });
      }

      const newFeedback = new Feedback({
        user: user._id,
        message: message,
      });

      const savedFeedback = await newFeedback.save();

      res.status(201).json({ message: 'Feedback submitted successfully.', feedback: savedFeedback });
    } catch (error) {
      console.error('Error creating feedback:', error);
      res.status(500).json({ error: 'Failed to submit feedback.' });
    }
  },

  getAllFeedbacks: async (req, res) => {
    try {
      console.log('Fetching all feedbacks for user:', req.user);

      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const feedbacks = await Feedback.find()
        .populate('user', 'FirstName LastName Email')
        .sort({ created_at: -1 });

      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
  },
};

module.exports = FeedbackController;
