// DOM Elements
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const historyBtn = document.getElementById('historyBtn');
const resultsContainer = document.getElementById('results');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const loadingSpinner = document.querySelector('.loading-spinner');

// Chart instance
let sentimentChart = null;

// API endpoints
const API_ENDPOINTS = {
    analyze: '/api/analyze',
    history: '/api/history'
};

// Initialize the application
function init() {
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    analyzeBtn.addEventListener('click', handleAnalysis);
    historyBtn.addEventListener('click', toggleHistory);
    textInput.addEventListener('input', () => {
        if (historySection.classList.contains('hidden') === false) {
            historySection.classList.add('hidden');
        }
    });
}

// Handle the sentiment analysis
async function handleAnalysis() {
    const text = textInput.value.trim();
    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    try {
        showLoading();
        const response = await fetch(API_ENDPOINTS.analyze, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Analysis failed');
        }

        const result = await response.json();
        displayResults(result);
        updateChart(result);
        historySection.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze text. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display analysis results
function displayResults(result) {
    // Update sentiment score
    const scoreElement = document.querySelector('.score-value');
    scoreElement.textContent = result.score;

    // Update classification
    const classificationElement = document.querySelector('.classification-value');
    classificationElement.textContent = result.classification;
    classificationElement.className = 'classification-value ' + result.classification.toLowerCase();

    // Update positive words
    const positiveWordsElement = document.querySelector('.positive-words-list');
    positiveWordsElement.innerHTML = result.positiveWords
        .map(word => `<span class="word-chip positive">${word}</span>`)
        .join('');

    // Update negative words
    const negativeWordsElement = document.querySelector('.negative-words-list');
    negativeWordsElement.innerHTML = result.negativeWords
        .map(word => `<span class="word-chip negative">${word}</span>`)
        .join('');
}

// Update or create sentiment chart
function updateChart(result) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    if (sentimentChart) {
        sentimentChart.destroy();
    }

    sentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sentiment Score'],
            datasets: [{
                label: 'Sentiment Analysis',
                data: [result.score],
                backgroundColor: result.score > 0 ? 'rgba(34, 197, 94, 0.2)' : 
                               result.score < 0 ? 'rgba(239, 68, 68, 0.2)' : 
                               'rgba(100, 116, 139, 0.2)',
                borderColor: result.score > 0 ? 'rgb(34, 197, 94)' : 
                            result.score < 0 ? 'rgb(239, 68, 68)' : 
                            'rgb(100, 116, 139)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: -5,
                    suggestedMax: 5
                }
            }
        }
    });
}

// Toggle history section
async function toggleHistory() {
    if (historySection.classList.contains('hidden')) {
        try {
            showLoading();
            const response = await fetch(API_ENDPOINTS.history);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            const history = await response.json();
            displayHistory(history);
            historySection.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch history. Please try again.');
        } finally {
            hideLoading();
        }
    } else {
        historySection.classList.add('hidden');
    }
}

// Display analysis history
function displayHistory(history) {
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <p><strong>Text:</strong> ${item.text}</p>
            <p><strong>Score:</strong> ${item.score}</p>
            <p><strong>Classification:</strong> 
                <span class="classification-value ${item.classification.toLowerCase()}">
                    ${item.classification}
                </span>
            </p>
            <p><small>Analyzed on: ${new Date(item.timestamp).toLocaleString()}</small></p>
        </div>
    `).join('');
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 