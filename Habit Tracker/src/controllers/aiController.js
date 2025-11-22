// @desc    Get habit suggestions based on goal
// @route   POST /suggest-habits
// @access  Public
const getSuggestions = async (req, res) => {
    const { goal } = req.body;

    if (!goal) {
        return res.status(400).json({ message: 'Please provide a goal' });
    }

    // Mock AI response
    // In a real app, this would call OpenAI or Gemini API
    const suggestions = [
        `Read about ${goal} for 15 mins`,
        `Practice ${goal} every morning`,
        `Join a community for ${goal}`
    ];

    // Simulate network delay
    setTimeout(() => {
        res.status(200).json({ suggestions });
    }, 500);
};

module.exports = {
    getSuggestions,
};
