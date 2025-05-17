const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Sentiment = require('sentiment');

const app = express();
const sentiment = new Sentiment();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

// Store sentiment analysis history (in-memory storage)
let analysisHistory = [];

// Analyze sentiment endpoint
app.post('/api/analyze', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = sentiment.analyze(text);
        
        // Determine sentiment classification
        let classification = 'Neutral';
        if (result.score > 0) classification = 'Positive';
        if (result.score < 0) classification = 'Negative';

        const analysis = {
            text,
            score: result.score,
            classification,
            positiveWords: result.positive,
            negativeWords: result.negative,
            timestamp: new Date().toISOString()
        };

        // Add to history
        analysisHistory.unshift(analysis);
        // Keep only last 10 entries
        if (analysisHistory.length > 10) {
            analysisHistory = analysisHistory.slice(0, 10);
        }

        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
});

// Get analysis history endpoint
app.get('/api/history', (req, res) => {
    res.json(analysisHistory);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 