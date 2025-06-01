// Course data structure for both tracks
const courses = {
    electrical: {
        'ECE 4500': {
            title: 'Microprocessors',
            credits: 3,
            assessments: {
                'Assignments': { weight: 10, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5'] },
                'Labs': { weight: 16, items: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'] },
                'Quizzes': { weight: 8, items: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'] },
                'Midterm': { weight: 16, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4300': {
            title: 'Electronic Circuits I',
            credits: 3,
            assessments: {
                'Quizzes': { weight: 10, items: ['Quiz 1', 'Quiz 2', 'Quiz 3'] },
                'Laboratory': { weight: 15, items: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'] },
                'Term Tests': { weight: 25, items: ['Term Test 1', 'Term Test 2'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4600': {
            title: 'Introduction to Systems and Signals',
            credits: 3,
            assessments: {
                'Assignments': { weight: 12, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5', 'Assignment 6'] },
                'Quizzes': { weight: 15, items: ['Quiz 1', 'Quiz 2'] },
                'Midterm': { weight: 23, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ENGI 4430': {
            title: 'Advanced Calculus for Engineering',
            credits: 3,
            assessments: {
                'Quizzes': { weight: 25, items: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'], dropLowest: 1 },
                'Midterm': { weight: 25, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4800': {
            title: 'Electromechanical Devices',
            credits: 3,
            assessments: {
                'Assignments': { weight: 10, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5'] },
                'Quizzes': { weight: 10, items: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'] },
                'Midterm': { weight: 20, items: ['Midterm Test'] },
                'Lab Work': { weight: 15, items: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6'] },
                'Final': { weight: 45, items: ['Final Exam'] }
            }
        }
    },
    computer: {
        'ECE 4500': {
            title: 'Microprocessors',
            credits: 3,
            assessments: {
                'Assignments': { weight: 10, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5'] },
                'Labs': { weight: 16, items: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'] },
                'Quizzes': { weight: 8, items: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'] },
                'Midterm': { weight: 16, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4110': {
            title: 'Discrete Mathematics for Computer Engineering',
            credits: 3,
            assessments: {
                'Quizzes': { weight: 25, items: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'], dropLowest: 1 },
                'Midterm': { weight: 25, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4300': {
            title: 'Electronic Circuits I',
            credits: 3,
            assessments: {
                'Quizzes': { weight: 10, items: ['Quiz 1', 'Quiz 2', 'Quiz 3'] },
                'Laboratory': { weight: 15, items: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'] },
                'Term Tests': { weight: 25, items: ['Term Test 1', 'Term Test 2'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        },
        'ECE 4400': {
            title: 'Data Structures',
            credits: 3,
            assessments: {
                'Assignments': { weight: 20, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5'] },
                'Midterm': { weight: 25, items: ['Midterm Test'] },
                'Coding Assessment': { weight: 20, items: ['Assessment 1', 'Assessment 2', 'Assessment 3', 'Assessment 4', 'Assessment 5'], dropLowest: 1 },
                'Final': { weight: 35, items: ['Final Exam'] }
            }
        },
        'ECE 4600': {
            title: 'Introduction to Systems and Signals',
            credits: 3,
            assessments: {
                'Assignments': { weight: 12, items: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Assignment 5', 'Assignment 6'] },
                'Quizzes': { weight: 15, items: ['Quiz 1', 'Quiz 2'] },
                'Midterm': { weight: 23, items: ['Midterm Test'] },
                'Final': { weight: 50, items: ['Final Exam'] }
            }
        }
    }
};

// Course management functions
function renderCourses(track) {
    const coursesGrid = document.getElementById(`${track}-courses-grid`);
    coursesGrid.innerHTML = '';
    
    Object.entries(courses[track]).forEach(([courseCode, courseData]) => {
        const courseCard = createCourseCard(courseCode, courseData, track);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(courseCode, courseData, track) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.id = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    
    const currentGrade = calculateCourseGrade(courseCode, track);
    const letterGrade = getLetterGrade(currentGrade);
    
    card.innerHTML = `
        <div class="course-header" onclick="toggleCourseExpansion(event, '${courseCode}', '${track}')">
            <div class="course-summary">
                <div class="course-info">
                    <h3>${courseCode}</h3>
                    <p>${courseData.title} • ${courseData.credits} credits</p>
                </div>
                <div class="course-stats">
                    <div class="course-grade-display">${currentGrade.toFixed(1)}%</div>
                    <div class="grade-letter grade-${letterGrade.toLowerCase()}">${letterGrade}</div>
                </div>
            </div>
            <span class="expand-indicator">▼</span>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(currentGrade, 100)}%"></div>
        </div>
        
        <div class="course-details">
            <div class="course-details-content">
                ${Object.entries(courseData.assessments).map(([category, data]) => 
                    createAssessmentSection(courseCode, category, data, track)
                ).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function createAssessmentSection(courseCode, category, data, track) {
    const courseGrades = grades[track] && grades[track][courseCode] && grades[track][courseCode][category] || {};
    
    return `
        <div class="assessment-group">
            <div class="assessment-header">
                <span class="assessment-title">${category}</span>
                <span class="assessment-weight">${data.weight}%</span>
            </div>
            <div class="assessment-inputs">
                ${data.items.map(item => {
                    const currentValue = courseGrades[item] || '';
                    return `
                        <div class="input-group">
                            <label for="${courseCode}-${category}-${item}">${item}</label>
                            <input 
                                type="number" 
                                id="${courseCode}-${category}-${item}"
                                min="0" 
                                max="100" 
                                step="0.1"
                                placeholder="0-100"
                                value="${currentValue}"
                                onchange="updateGrade('${courseCode}', '${category}', '${item}', this.value, '${track}')"
                            />
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function toggleCourseExpansion(event, courseCode, track) {
    // Prevent event bubbling to avoid triggering other cards
    event.stopPropagation();
    
    const card = document.getElementById(`course-${courseCode.replace(/\s/g, '-')}-${track}`);
    card.classList.toggle('expanded');
}
