# Sentiment Analysis Web Application

A full-stack web application that performs sentiment analysis on text input using natural language processing. Built with modern web technologies and a beautiful, responsive UI.

## Features

- Real-time sentiment analysis of text input
- Visual representation of sentiment scores using Chart.js
- Identification of positive and negative words
- Analysis history tracking
- Responsive design for all devices
- Modern UI with animations and transitions
- Interactive data visualization

## Technologies Used

- Frontend:
  - HTML5
  - CSS3 (Modern features: Grid, Flexbox, Variables)
  - JavaScript (ES6+)
  - Chart.js for data visualization
  - Modern UI/UX principles
  
- Backend:
  - Node.js
  - Express.js
  - Sentiment npm package for analysis
  - In-memory storage for history

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter text in the textarea
2. Click "Analyze Sentiment" to process the text
3. View results including:
   - Sentiment score
   - Classification (Positive/Negative/Neutral)
   - Identified positive and negative words
   - Visual representation of the sentiment
4. View analysis history using the "View Analysis History" button

## Project Structure

```
sentiment-analysis/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/analyze`: Analyze text sentiment
  - Request body: `{ "text": "string" }`
  - Response: `{ "score": number, "classification": string, "positiveWords": string[], "negativeWords": string[] }`

- `GET /api/history`: Get analysis history
  - Response: Array of previous analyses

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 