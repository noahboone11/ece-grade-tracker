// Grade calculation functions
function calculateCourseGrade(courseCode, track) {
    const courseData = courses[track][courseCode];
    const courseGrades = grades[track][courseCode];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    Object.entries(courseData.assessments).forEach(([category, data]) => {
        const categoryGrades = courseGrades[category] || {};
        
        const scores = data.items.map(item => {
            const itemName = typeof item === 'object' ? item.name : item;
            return categoryGrades[itemName];
        }).filter(score => score !== null && score !== undefined && score !== '');
        
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
    
    // Calculate the GPA for each course and then average them
    const courseGPAs = courseGrades.map(grade => convertToGPA(grade));
    const averageGPA = courseGPAs.length > 0 ? 
        courseGPAs.reduce((sum, gpa) => sum + gpa, 0) / courseGPAs.length : 0;
    
    const average = courseGrades.length > 0 ? 
        courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length : 0;
    
    // Update consolidated dashboard elements
    const avgElement = document.getElementById('avg-display');
    avgElement.textContent = `${average.toFixed(1)}%`;
    
    // Apply grade quality color to average grade
    const avgLetterGrade = getLetterGrade(average);
    avgElement.className = `avg-grade-${avgLetterGrade.toLowerCase()}`;
    
    // Update GPA display with quality color
    const gpaElement = document.getElementById('gpa-display');
    gpaElement.textContent = averageGPA.toFixed(2);
    
    // Apply GPA quality color
    const gpaQualityClass = getGPAQualityClass(averageGPA);
    gpaElement.className = gpaQualityClass;
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
    
    // Re-render the specific course card while preserving expansion state
    const cardId = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    const oldCard = document.getElementById(cardId);
    const wasExpanded = oldCard?.classList.contains('expanded');
    
    const coursesGrid = document.getElementById('courses-grid');
    const courseIndex = Object.keys(courses[track]).indexOf(courseCode);
    const courseCard = coursesGrid.children[courseIndex];
    
    if (courseCard) {
        const newCard = createCourseCard(courseCode, courses[track][courseCode], track);
        if (wasExpanded) {
            newCard.classList.add('expanded');
        }
        coursesGrid.replaceChild(newCard, courseCard);
    }
    
    updateOverallStats(track);
    
    // NOW update upcoming assessments with the final value
    if (typeof onGradeUpdate === 'function') {
        onGradeUpdate(track);
    }
}