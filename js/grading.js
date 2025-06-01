// Grade calculation functions
function calculateCourseGrade(courseCode, track) {
    const courseData = courses[track][courseCode];
    const courseGrades = grades[track][courseCode];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    Object.entries(courseData.assessments).forEach(([category, data]) => {
        const categoryGrades = courseGrades[category] || {};
        const scores = data.items.map(item => categoryGrades[item]).filter(score => score !== null && score !== undefined);
        
        if (scores.length > 0) {
            let categoryAverage;
            
            if (data.dropLowest && scores.length > data.dropLowest) {
                // Drop lowest grades
                scores.sort((a, b) => b - a); // Sort descending
                const keepScores = scores.slice(0, scores.length - data.dropLowest);
                categoryAverage = keepScores.reduce((sum, score) => sum + score, 0) / keepScores.length;
            } else {
                categoryAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            }
            
            totalWeightedScore += categoryAverage * data.weight;
            totalWeight += data.weight;
        }
    });
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

function updateOverallStats(track) {
    const courseGrades = Object.keys(courses[track]).map(courseCode => 
        calculateCourseGrade(courseCode, track)
    ).filter(grade => grade > 0);
    
    const average = courseGrades.length > 0 ? 
        courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length : 0;
    
    const gpa = convertToGPA(average);
    
    document.getElementById(`${track}-avg`).textContent = `${average.toFixed(1)}%`;
    document.getElementById(`${track}-gpa`).textContent = gpa.toFixed(2);
}

function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function convertToGPA(percentage) {
    if (percentage >= 90) return 4.0;
    if (percentage >= 85) return 3.7;
    if (percentage >= 80) return 3.3;
    if (percentage >= 77) return 3.0;
    if (percentage >= 73) return 2.7;
    if (percentage >= 70) return 2.3;
    if (percentage >= 67) return 2.0;
    if (percentage >= 63) return 1.7;
    if (percentage >= 60) return 1.3;
    if (percentage >= 57) return 1.0;
    return 0.0;
}

function updateGrade(courseCode, category, item, value, track) {
    if (!grades[track][courseCode][category]) {
        grades[track][courseCode][category] = {};
    }
    
    grades[track][courseCode][category][item] = value ? parseFloat(value) : null;
    
    // Save user data
    saveUserData();
    
    // Re-render the specific course card while preserving expansion state
    const cardId = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    const oldCard = document.getElementById(cardId);
    const wasExpanded = oldCard.classList.contains('expanded');
    
    const coursesGrid = document.getElementById(`${track}-courses-grid`);
    const courseIndex = Object.keys(courses[track]).indexOf(courseCode);
    const courseCard = coursesGrid.children[courseIndex];
    
    const newCard = createCourseCard(courseCode, courses[track][courseCode], track);
    if (wasExpanded) {
        newCard.classList.add('expanded');
    }
    coursesGrid.replaceChild(newCard, courseCard);
    
    // Update overall stats
    updateOverallStats(track);
}