const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Symptom analysis endpoint
app.post('/api/analyze-symptoms', (req, res) => {
    try {
        const { symptoms, painLevel } = req.body;
        
        // For now, use the mock implementation from the frontend
        // In a production environment, you would call your Python model here
        const mockResults = getMockResults(symptoms, parseInt(painLevel));
        
        setTimeout(() => {
            res.json(mockResults);
        }, 1000); // Simulate processing time
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred during analysis' });
    }
});

// Mock results function (same as in frontend)
function getMockResults(symptoms, painLevel) {
    const possibleConditions = {
        'Fever': ['Common Cold', 'Flu', 'COVID-19', 'Malaria'],
        'Cough': ['Common Cold', 'Bronchitis', 'Pneumonia', 'COVID-19'],
        'Headache': ['Tension Headache', 'Migraine', 'Sinus Infection', 'Dehydration'],
        // ... other symptoms as in frontend code
    };
    
    // Count occurrences of each condition
    const conditionCounts = {};
    
    symptoms.forEach(symptom => {
        if (possibleConditions[symptom]) {
            possibleConditions[symptom].forEach(condition => {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            });
        }
    });
    
    // Calculate probabilities
    const predictions = [];
    
    for (const [condition, count] of Object.entries(conditionCounts)) {
        let probability = (count / symptoms.length) * 100;
        
        if (painLevel > 7 && ['Heart Attack', 'Kidney Stones', 'Migraine', 'Appendicitis'].includes(condition)) {
            probability += 20;
        }
        
        predictions.push({
            condition,
            probability: Math.min(probability, 95)
        });
    }
    
    predictions.sort((a, b) => b.probability - a.probability);
    
    // Generate recommendations
    let recommendation = '';
    const topCondition = predictions[0];
    
    if (topCondition && topCondition.probability > 70) {
        if (['Heart Attack', 'Stroke', 'Appendicitis'].includes(topCondition.condition)) {
            recommendation = 'URGENT: Seek immediate medical attention.';
        } else if (painLevel >= 8) {
            recommendation = 'You should see a doctor as soon as possible.';
        } else {
            recommendation = 'Consider consulting with a healthcare provider about these symptoms.';
        }
    } else if (predictions.length > 0) {
        recommendation = 'Your symptoms could indicate several possible conditions. A healthcare provider can help determine the exact cause.';
    } else {
        recommendation = 'Based on the limited symptoms provided, it\'s difficult to determine a specific condition. Monitor your symptoms and consult a healthcare provider if they persist or worsen.';
    }
    
    return {
        predictions: predictions.slice(0, 3),
        recommendation
    };
}

// For a production implementation, add this function to call the Python model
function callPythonModel(symptoms, painLevel) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', [
            'symptom_model.py',
            JSON.stringify(symptoms),
            painLevel.toString()
        ]);
        
        let result = '';
        
        python.stdout.on('data', (data) => {
            result += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
            reject(`Error: ${data}`);
        });
        
        python.on('close', (code) => {
            if (code !== 0) {
                reject(`Process exited with code ${code}`);
                return;
            }
            
            try {
                const predictions = JSON.parse(result);
                resolve(predictions);
            } catch (error) {
                reject(`Error parsing prediction results: ${error}`);
            }
        });
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});