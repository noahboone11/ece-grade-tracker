// Grade calculation functions
function calculateCourseGrade(courseCode, track) {
    const courseData = courses[track][courseCode];
    const courseGrades = grades[track][courseCode];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    Object.entries(courseData.assessments).forEach(([category, data]) => {
        const categoryGrades = courseGrades[category] || {};

        const hasItemWeights = data.items.some(item => typeof item === 'object' && item.weight != null);

        if (hasItemWeights) {
            // Per-item weighted calculation: each item contributes independently
            data.items.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                const itemWeight = (typeof item === 'object' && item.weight != null)
                    ? item.weight
                    : data.weight / data.items.length;
                const score = categoryGrades[itemName];
                if (score !== null && score !== undefined && score !== '') {
                    totalWeightedScore += parseFloat(score) * itemWeight;
                    totalWeight += itemWeight;
                }
            });
        } else {
            // Uniform distribution: average all entered items, apply category weight
            const scores = data.items.map(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                return categoryGrades[itemName];
            }).filter(score => score !== null && score !== undefined && score !== '');

            if (scores.length > 0) {
                let categoryAverage;

                if (data.dropLowest && scores.length > data.dropLowest) {
                    scores.sort((a, b) => b - a);
                    const keepScores = scores.slice(0, scores.length - data.dropLowest);
                    categoryAverage = keepScores.reduce((sum, score) => sum + score, 0) / keepScores.length;
                } else {
                    categoryAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                }

                totalWeightedScore += categoryAverage * data.weight;
                totalWeight += data.weight;
            }
        }
    });
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

function updateOverallStats(track) {
    const allCourseCodes = Object.keys(courses[track]);
    const courseGrades = allCourseCodes.map(courseCode =>
        calculateCourseGrade(courseCode, track)
    ).filter(grade => grade > 0);

    // Calculate the GPA for each course and then average them
    const courseGPAs = courseGrades.map(grade => convertToGPA(grade));
    const averageGPA = courseGPAs.length > 0 ?
        courseGPAs.reduce((sum, gpa) => sum + gpa, 0) / courseGPAs.length : 0;

    const average = courseGrades.length > 0 ?
        courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length : 0;

    // Update average grade display
    const avgElement = document.getElementById('avg-display');
    avgElement.textContent = `${average.toFixed(1)}%`;
    const avgLetterGrade = getLetterGrade(average);
    avgElement.className = `avg-grade-${avgLetterGrade.toLowerCase()}`;

    // Update GPA display
    const gpaElement = document.getElementById('gpa-display');
    gpaElement.textContent = averageGPA.toFixed(2);
    gpaElement.className = getGPAQualityClass(averageGPA);

    // Update passing courses count
    const passingElement = document.getElementById('passing-display');
    if (passingElement) {
        const passingCount = allCourseCodes.filter(courseCode =>
            calculateCourseGrade(courseCode, track) >= 50
        ).length;
        const total = allCourseCodes.length;
        passingElement.textContent = `${passingCount}/${total}`;
        passingElement.className = passingCount === total ? 'gpa-a'
            : passingCount >= Math.ceil(total / 2) ? 'gpa-b'
            : 'gpa-f';
    }
}

function getLetterGrade(percentage) {
    if (percentage >= 80) return 'A';
    if (percentage >= 65) return 'B';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

function getGradeQualityClass(letterGrade) {
    return `grade-${letterGrade.toLowerCase()}`;
}

function getGPAQualityClass(gpa) {
    if (gpa >= 3.5) return 'gpa-a';      // 3.5-4.0: Excellent
    if (gpa >= 2.5) return 'gpa-b';      // 2.5-3.49: Good
    if (gpa >= 1.5) return 'gpa-c';      // 1.5-2.49: Average
    if (gpa >= 0.5) return 'gpa-d';      // 0.5-1.49: Below average
    return 'gpa-f';                      // 0.0-0.49: Poor
}

function convertToGPA(percentage) {
    if (percentage >= 80) return 4.0;  // A: 80-100%
    if (percentage >= 65) return 3.0;  // B: 65-79%
    if (percentage >= 55) return 2.0;  // C: 55-64%
    if (percentage >= 50) return 1.0;  // D: 50-54%
    return 0.0;                        // F: below 50%
}

function updateGradeData(courseCode, category, item, value, track) {
    if (!grades[track][courseCode][category]) {
        grades[track][courseCode][category] = {};
    }
    
    // Update the grade data immediately but don't update completion status yet
    grades[track][courseCode][category][item] = value !== '' ? parseFloat(value) : null;
    
    // Don't update upcoming assessments here - wait until user is done typing
}

// Full update with visual re-rendering (for onblur/onchange)
function updateGrade(courseCode, category, item, value, track) {
    // First do the immediate data update
    updateGradeData(courseCode, category, item, value, track);
    
    // Save data
    saveUserData();
    
    rerenderCourseCard(courseCode, track);
    
    updateOverallStats(track);
    
    // NOW update upcoming assessments with the final value
    if (typeof onGradeUpdate === 'function') {
        onGradeUpdate(track);
    }
}