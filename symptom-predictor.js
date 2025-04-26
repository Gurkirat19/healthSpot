document.addEventListener('DOMContentLoaded', function() {
    // Common symptoms list
    const commonSymptoms = [
        'Fever', 'Cough', 'Headache', 'Fatigue', 'Chest pain',
        'Shortness of breath', 'Sore throat', 'Runny nose', 'Muscle pain',
        'Joint pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation',
        'Abdominal pain', 'Back pain', 'Dizziness', 'Sweating', 'Loss of appetite',
        'Weight loss', 'Skin rash', 'Itching', 'Swelling', 'Blurred vision',
        'Eye pain', 'Ear pain', 'Hearing loss', 'Numbness', 'Tingling',
        'Weakness', 'Confusion', 'Memory problems', 'Anxiety', 'Depression'
    ];

    // DOM Elements
    const symptomSearch = document.getElementById('symptom-search');
    const symptomList = document.getElementById('symptom-list');
    const selectedSymptomsContainer = document.getElementById('selected-symptoms-container');
    const noSymptomsMessage = document.getElementById('no-symptoms');
    const painLevel = document.getElementById('pain-level');
    const painValue = document.getElementById('pain-value');
    const durationSelect = document.getElementById('duration');
    const additionalInfo = document.getElementById('additional-info');
    const analyzeButton = document.getElementById('analyze-button');
    const resultsContainer = document.getElementById('results-container');
    const predictionsDiv = document.getElementById('predictions');
    const recommendationsDiv = document.getElementById('recommendations');
    const findDoctorButton = document.getElementById('find-doctor');
    const resetButton = document.getElementById('reset');
    const loadingIndicator = document.getElementById('loading');

    // Track selected symptoms
    let selectedSymptoms = [];

    // Initialize symptom list
    function initializeSymptomList() {
        symptomList.innerHTML = '';
        commonSymptoms.forEach(symptom => {
            const symptomItem = document.createElement('div');
            symptomItem.className = 'symptom-item';
            symptomItem.textContent = symptom;
            symptomItem.addEventListener('click', () => {
                if (!selectedSymptoms.includes(symptom)) {
                    addSymptom(symptom);
                }
            });
            symptomList.appendChild(symptomItem);
        });
    }

    // Add a symptom to the selected list
    function addSymptom(symptom) {
        selectedSymptoms.push(symptom);
        updateSelectedSymptomsDisplay();
    }

    // Remove a symptom from the selected list
    function removeSymptom(symptom) {
        selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
        updateSelectedSymptomsDisplay();
    }

    // Update the display of selected symptoms
    function updateSelectedSymptomsDisplay() {
        if (selectedSymptoms.length === 0) {
            selectedSymptomsContainer.innerHTML = '';
            selectedSymptomsContainer.appendChild(noSymptomsMessage);
        } else {
            selectedSymptomsContainer.innerHTML = '';
            
            selectedSymptoms.forEach(symptom => {
                const symptomTag = document.createElement('div');
                symptomTag.className = 'symptom-tag';
                symptomTag.innerHTML = `
                    ${symptom}
                    <span class="remove-btn" data-symptom="${symptom}">&times;</span>
                `;
                selectedSymptomsContainer.appendChild(symptomTag);
            });
            
            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeSymptom(this.dataset.symptom);
                });
            });
        }
    }

    // Filter symptoms based on search
    function filterSymptoms(query) {
        const filteredSymptoms = commonSymptoms.filter(symptom => 
            symptom.toLowerCase().includes(query.toLowerCase())
        );
        
        symptomList.innerHTML = '';
        
        if (filteredSymptoms.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No matching symptoms found';
            noResults.style.padding = '10px';
            noResults.style.color = '#666';
            symptomList.appendChild(noResults);
        } else {
            filteredSymptoms.forEach(symptom => {
                const symptomItem = document.createElement('div');
                symptomItem.className = 'symptom-item';
                symptomItem.textContent = symptom;
                symptomItem.addEventListener('click', () => {
                    if (!selectedSymptoms.includes(symptom)) {
                        addSymptom(symptom);
                    }
                });
                symptomList.appendChild(symptomItem);
            });
        }
    }

    // Mock prediction functionality (to be replaced with actual model)
    async function analyzeSymptoms() {
        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom');
            return;
        }
        
        if (!durationSelect.value) {
            alert('Please select a duration');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock analysis results (would normally come from the model)
            const mockResults = getMockResults(selectedSymptoms, parseInt(painLevel.value));
            
            // Display results
            displayResults(mockResults);
            
            // Hide loading, show results
            loadingIndicator.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing symptoms');
            loadingIndicator.classList.add('hidden');
        }
    }

    // Generate mock results based on symptoms - this will be replaced with the actual model
    function getMockResults(symptoms, painLevel) {
        const possibleConditions = {
            'Fever': ['Common Cold', 'Flu', 'COVID-19', 'Malaria'],
            'Cough': ['Common Cold', 'Bronchitis', 'Pneumonia', 'COVID-19'],
            'Headache': ['Tension Headache', 'Migraine', 'Sinus Infection', 'Dehydration'],
            'Fatigue': ['Anemia', 'Sleep Apnea', 'Depression', 'Chronic Fatigue Syndrome'],
            'Chest pain': ['Angina', 'Heart Attack', 'Acid Reflux', 'Muscle Strain'],
            'Shortness of breath': ['Asthma', 'Pneumonia', 'Anxiety', 'Heart Failure'],
            'Sore throat': ['Pharyngitis', 'Tonsillitis', 'Common Cold', 'Strep Throat'],
            'Runny nose': ['Common Cold', 'Allergies', 'Sinusitis', 'Flu'],
            'Muscle pain': ['Fibromyalgia', 'Flu', 'Overexertion', 'Rheumatoid Arthritis'],
            'Joint pain': ['Osteoarthritis', 'Rheumatoid Arthritis', 'Gout', 'Lupus'],
            'Nausea': ['Food Poisoning', 'Gastroenteritis', 'Migraines', 'Pregnancy'],
            'Vomiting': ['Food Poisoning', 'Gastroenteritis', 'Appendicitis', 'Concussion'],
            'Diarrhea': ['Food Poisoning', 'Irritable Bowel Syndrome', 'Crohn\'s Disease', 'Gastroenteritis'],
            'Constipation': ['Irritable Bowel Syndrome', 'Dehydration', 'Hypothyroidism', 'Medication Side Effect'],
            'Abdominal pain': ['Appendicitis', 'Gastritis', 'Gallstones', 'Kidney Stones'],
            'Back pain': ['Muscle Strain', 'Herniated Disc', 'Sciatica', 'Osteoporosis'],
            'Dizziness': ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Infection'],
            'Sweating': ['Hyperhidrosis', 'Menopause', 'Anxiety', 'Fever'],
            'Loss of appetite': ['Depression', 'Viral Infection', 'Cancer', 'Hepatitis'],
            'Weight loss': ['Thyroid Disorder', 'Diabetes', 'Depression', 'Cancer'],
            'Skin rash': ['Eczema', 'Psoriasis', 'Contact Dermatitis', 'Allergic Reaction'],
            'Itching': ['Dry Skin', 'Allergies', 'Eczema', 'Psoriasis'],
            'Swelling': ['Edema', 'Insect Bite', 'Allergic Reaction', 'Infection'],
            'Blurred vision': ['Myopia', 'Cataracts', 'Glaucoma', 'Diabetes'],
            'Eye pain': ['Conjunctivitis', 'Glaucoma', 'Eye Strain', 'Corneal Abrasion'],
            'Ear pain': ['Ear Infection', 'Earwax Buildup', 'Tooth Infection', 'Temporomandibular Joint Disorder'],
            'Hearing loss': ['Age-Related Hearing Loss', 'Ear Infection', 'Earwax Buildup', 'Loud Noise Exposure'],
            'Numbness': ['Peripheral Neuropathy', 'Multiple Sclerosis', 'Stroke', 'Carpal Tunnel Syndrome'],
            'Tingling': ['Peripheral Neuropathy', 'Multiple Sclerosis', 'Vitamin B12 Deficiency', 'Carpal Tunnel Syndrome'],
            'Weakness': ['Stroke', 'Multiple Sclerosis', 'Myasthenia Gravis', 'Chronic Fatigue Syndrome'],
            'Confusion': ['Delirium', 'Dementia', 'Medication Side Effect', 'Infection'],
            'Memory problems': ['Alzheimer\'s Disease', 'Mild Cognitive Impairment', 'Depression', 'Sleep Apnea'],
            'Anxiety': ['Generalized Anxiety Disorder', 'Panic Disorder', 'Social Anxiety Disorder', 'Post-Traumatic Stress Disorder'],
            'Depression': ['Major Depressive Disorder', 'Bipolar Disorder', 'Seasonal Affective Disorder', 'Dysthymia']
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
        
        // Calculate probabilities based on symptom matches and pain level
        let totalConditions = Object.keys(conditionCounts).length;
        const predictions = [];
        
        for (const [condition, count] of Object.entries(conditionCounts)) {
            // Base probability on symptom match frequency
            let probability = (count / symptoms.length) * 100;
            
            // Adjust based on pain level (higher pain increases probability for certain conditions)
            if (painLevel > 7 && ['Heart Attack', 'Kidney Stones', 'Migraine', 'Appendicitis'].includes(condition)) {
                probability += 20;
            }
            
            predictions.push({
                condition,
                probability: Math.min(probability, 95) // Cap at 95%
            });
        }
        
        // Sort by probability
        predictions.sort((a, b) => b.probability - a.probability);
        
        // Generate recommendations
        let recommendation = '';
        const topCondition = predictions[0];
        
        if (topCondition && topCondition.probability > 70) {
            // High confidence
            if (['Heart Attack', 'Stroke', 'Appendicitis'].includes(topCondition.condition)) {
                recommendation = 'URGENT: Seek immediate medical attention.';
            } else if (painLevel >= 8) {
                recommendation = 'You should see a doctor as soon as possible.';
            } else {
                recommendation = 'Consider consulting with a healthcare provider about these symptoms.';
            }
        } else if (predictions.length > 0) {
            // Moderate confidence
            recommendation = 'Your symptoms could indicate several possible conditions. A healthcare provider can help determine the exact cause.';
        } else {
            // Low confidence
            recommendation = 'Based on the limited symptoms provided, it\'s difficult to determine a specific condition. Monitor your symptoms and consult a healthcare provider if they persist or worsen.';
        }
        
        return {
            predictions: predictions.slice(0, 3), // Top 3 predictions
            recommendation
        };
    }

    // Display the analysis results
    function displayResults(results) {
        predictionsDiv.innerHTML = '';
        
        results.predictions.forEach(prediction => {
            const predictionEl = document.createElement('div');
            predictionEl.className = 'prediction';
            predictionEl.innerHTML = `
                <h3>${prediction.condition}</h3>
                <p>Probability: ${prediction.probability.toFixed(1)}%</p>
                <div class="prediction-bar">
                    <div class="prediction-fill" style="width: ${prediction.probability}%"></div>
                </div>
            `;
            predictionsDiv.appendChild(predictionEl);
        });
        
        recommendationsDiv.innerHTML = `
            <h3>Recommendation:</h3>
            <p>${results.recommendation}</p>
            <p class="disclaimer">Remember: This is not a medical diagnosis. Always consult with a healthcare provider for proper evaluation.</p>
        `;
    }

    // Event Listeners
    symptomSearch.addEventListener('input', function() {
        filterSymptoms(this.value);
    });
    
    painLevel.addEventListener('input', function() {
        painValue.textContent = this.value;
    });
    
    analyzeButton.addEventListener('click', analyzeSymptoms);
    
    findDoctorButton.addEventListener('click', function() {
        window.location.href = 'doctor.html';
    });
    
    resetButton.addEventListener('click', function() {
        selectedSymptoms = [];
        updateSelectedSymptomsDisplay();
        painLevel.value = 0;
        painValue.textContent = '0';
        durationSelect.selectedIndex = 0;
        additionalInfo.value = '';
        resultsContainer.classList.add('hidden');
    });
    
    // Initialize
    initializeSymptomList();
    updateSelectedSymptomsDisplay();
});