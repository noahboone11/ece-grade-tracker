// Get course color class name
function getCourseColorClass(courseCode) {
    return `course-${courseCode.toLowerCase().replace(/\s/g, '')}`;
}

// Shared courses that appear in both tracks
const sharedCourses = {
    'ECE 4500': {
        title: 'Microprocessors',
        assessments: {
            'Assignments': {
                weight: 10,
                items: [
                    { name: 'Assignment 1', dueDate: '2025-06-02' },
                    { name: 'Assignment 2', dueDate: '2025-06-13' },
                    { name: 'Assignment 3', dueDate: '2025-06-27' },
                    { name: 'Assignment 4', dueDate: '2025-07-11' },
                    { name: 'Assignment 5', dueDate: '2025-07-25' }
                ]
            },
            'Labs': {
                weight: 16,
                items: [
                    { name: 'Lab 0', dueDate: '2025-05-23' },
                    { name: 'Lab 1', dueDate: '2025-05-30' },
                    { name: 'Lab 2', dueDate: '2025-06-13' },
                    { name: 'Lab 3', dueDate: '2025-06-20' },
                    { name: 'Lab 4', dueDate: '2025-06-27' },
                    { name: 'Lab 5', dueDate: '2025-07-04' },
                    { name: 'Lab 6', dueDate: '2025-07-11' },
                    { name: 'Lab 7', dueDate: '2025-07-18' }
                ]
            },
            'Quizzes': {
                weight: 8,
                items: [
                    { name: 'Quiz 1', dueDate: '2025-05-12' },
                    { name: 'Quiz 2', dueDate: '2025-05-26' },
                    { name: 'Quiz 3', dueDate: '2025-06-16' },
                    { name: 'Quiz 4', dueDate: '2025-06-30' }
                ]
            },
            'Midterm': {
                weight: 16,
                items: [{ name: 'Midterm Test', dueDate: '2025-06-09' }]
            },
            'Final': {
                weight: 50,
                items: [{ name: 'Final Exam', dueDate: '2025-08-12' }]
            }
        }
    },
    'ECE 4300': {
        title: 'Electronic Circuits I',
        assessments: {
            'Quizzes': {
                weight: 10,
                items: [
                    { name: 'Quiz 1', dueDate: '2025-05-26' },
                    { name: 'Quiz 2', dueDate: '2025-06-06' },
                    { name: 'Quiz 3', dueDate: '2025-07-07' }
                ],
                dropLowest: 1
            },
            'Laboratory': {
                weight: 15,
                items: [
                    { name: 'Lab 1', dueDate: '2025-05-28' },
                    { name: 'Lab 2', dueDate: '2025-06-04' },
                    { name: 'Lab 3', dueDate: '2025-06-11' },
                    { name: 'Lab 4', dueDate: '2025-06-18' },
                    { name: 'Lab 5', dueDate: '2025-07-02' },
                    { name: 'Lab 6', dueDate: '2025-07-16' },
                    { name: 'Lab 7', dueDate: '2025-07-23' },
                    { name: 'Lab 8', dueDate: '2025-07-30' }
                ]
            },
            'Term Tests': {
                weight: 25,
                items: [
                    { name: 'Term Test 1', dueDate: '2025-06-13' },
                    { name: 'Term Test 2', dueDate: '2025-07-16' }
                ]
            },
            'Final': {
                weight: 50,
                items: [{ name: 'Final Exam', dueDate: '2025-08-14' }]
            }
        }
    },
    'ECE 4600': {
        title: 'Introduction to Systems and Signals',
        assessments: {
            'Assignments': {
                weight: 12,
                items: [
                    { name: 'Assignment 1', dueDate: '2025-05-22' },
                    { name: 'Assignment 2', dueDate: '2025-06-05' },
                    { name: 'Assignment 3', dueDate: '2025-06-19' },
                    { name: 'Assignment 4', dueDate: '2025-07-03' },
                    { name: 'Assignment 5', dueDate: '2025-07-17' },
                    { name: 'Assignment 6', dueDate: '2025-07-25' }
                ]
            },
            'Quizzes': {
                weight: 15,
                items: [
                    { name: 'Quiz 1', dueDate: '2025-05-27' },
                    { name: 'Quiz 2', dueDate: '2025-07-15' }
                ]
            },
            'Midterm': {
                weight: 23,
                items: [{ name: 'Midterm Test', dueDate: '2025-06-24' }]
            },
            'Final': {
                weight: 50,
                items: [{ name: 'Final Exam', dueDate: '2025-08-11' }]
            }
        }
    }
};

// Track-specific courses
const trackSpecificCourses = {
    electrical: {
        'ENGI 4430': {
            title: 'Advanced Calculus for Engineering',
            assessments: {
                'Quizzes': {
                    weight: 25,
                    items: [
                        { name: 'Quiz 1', dueDate: '2025-05-21' },
                        { name: 'Quiz 2', dueDate: '2025-06-04' },
                        { name: 'Quiz 3', dueDate: '2025-06-20' },
                        { name: 'Quiz 4', dueDate: '2025-07-02' },
                        { name: 'Quiz 5', dueDate: '2025-07-16' }
                    ],
                    dropLowest: 1
                },
                'Midterm': {
                    weight: 25,
                    items: [{ name: 'Midterm Test', dueDate: '2025-06-11' }]
                },
                'Final': {
                    weight: 50,
                    items: [{ name: 'Final Exam', dueDate: '2025-08-13' }]
                }
            }
        },
        'ECE 4800': {
            title: 'Electromechanical Devices',
            assessments: {
                'Assignments': {
                    weight: 10,
                    items: [
                        { name: 'Assignment 1', dueDate: '2025-05-26' },
                        { name: 'Assignment 2', dueDate: '2025-06-16' },
                        { name: 'Assignment 3', dueDate: '2025-07-02' },
                        { name: 'Assignment 4', dueDate: '2025-07-15' },
                        { name: 'Assignment 5', dueDate: '2025-07-25' }
                    ]
                },
                'Quizzes': {
                    weight: 10,
                    items: [
                        { name: 'Quiz 1', dueDate: '2025-05-30' },
                        { name: 'Quiz 2', dueDate: '2025-06-13' },
                        { name: 'Quiz 3', dueDate: '2025-07-11' },
                        { name: 'Quiz 4', dueDate: '2025-07-18' }
                    ]
                },
                'Midterm': {
                    weight: 20,
                    items: [{ name: 'Midterm Test', dueDate: '2025-06-23' }]
                },
                'Lab Work': {
                    weight: 15,
                    items: [
                        { name: 'Lab 1', dueDate: '2025-05-30' },
                        { name: 'Lab 2', dueDate: '2025-06-13' },
                        { name: 'Lab 3', dueDate: '2025-06-27' },
                        { name: 'Lab 4', dueDate: '2025-07-11' },
                        { name: 'Lab 5', dueDate: '2025-07-25' },
                        { name: 'Lab 6', dueDate: '2025-08-01' }
                    ]
                },
                'Final': {
                    weight: 45,
                    items: [{ name: 'Final Exam', dueDate: '2025-08-15' }]
                }
            }
        }
    },
    computer: {
        'ECE 4110': {
            title: 'Discrete Mathematics for Computer Engineering',
            assessments: {
                'Quizzes': {
                    weight: 25,
                    items: [
                        { name: 'Quiz 1', dueDate: '2025-05-22' },
                        { name: 'Quiz 2', dueDate: '2025-06-05' },
                        { name: 'Quiz 3', dueDate: '2025-06-19' },
                        { name: 'Quiz 4', dueDate: '2025-07-03' },
                        { name: 'Quiz 5', dueDate: '2025-07-17' }
                    ],
                    dropLowest: 1
                },
                'Midterm': {
                    weight: 25,
                    items: [{ name: 'Midterm Test', dueDate: '2025-06-12' }]
                },
                'Final': {
                    weight: 50,
                    items: [{ name: 'Final Exam', dueDate: '2025-08-16' }]
                }
            }
        },
        'ECE 4400': {
            title: 'Data Structures',
            assessments: {
                'Assignments': {
                    weight: 20,
                    items: [
                        { name: 'Assignment 1', dueDate: '2025-05-25' },
                        { name: 'Assignment 2', dueDate: '2025-06-08' },
                        { name: 'Assignment 3', dueDate: '2025-06-22' },
                        { name: 'Assignment 4', dueDate: '2025-07-06' },
                        { name: 'Assignment 5', dueDate: '2025-07-27' }
                    ]
                },
                'Midterm': {
                    weight: 25,
                    items: [{ name: 'Midterm Test', dueDate: '2025-06-10' }]
                },
                'Coding Assessment': {
                    weight: 20,
                    items: [
                        { name: 'Assessment 1', dueDate: '2025-05-16' },
                        { name: 'Assessment 2', dueDate: '2025-05-30' },
                        { name: 'Assessment 3', dueDate: '2025-06-27' },
                        { name: 'Assessment 4', dueDate: '2025-07-11' },
                        { name: 'Assessment 5', dueDate: '2025-07-18' }
                    ],
                    dropLowest: 1
                },
                'Final': {
                    weight: 35,
                    items: [{ name: 'Final Exam', dueDate: '2025-08-17' }]
                }
            }
        }
    }
};

// Build complete courses object by combining shared and track-specific courses
const courses = {
    electrical: { ...sharedCourses, ...trackSpecificCourses.electrical },
    computer: { ...sharedCourses, ...trackSpecificCourses.computer }
};

// Utility functions
function getEffectiveDueDate(courseCode, category, itemName, track) {
    if (currentUser?.customDueDates?.[track]?.[courseCode]?.[category]?.[itemName]) {
        return currentUser.customDueDates[track][courseCode][category][itemName];
    }
    
    const courseData = courses[track][courseCode];
    const item = courseData.assessments[category].items.find(i => 
        (typeof i === 'object' ? i.name : i) === itemName
    );
    return typeof item === 'object' ? item.dueDate : null;
}

function updateDueDate(courseCode, category, itemName, newDate, track) {
    // Initialize nested objects if they don't exist
    if (!currentUser.customDueDates) currentUser.customDueDates = {};
    if (!currentUser.customDueDates[track]) currentUser.customDueDates[track] = {};
    if (!currentUser.customDueDates[track][courseCode]) currentUser.customDueDates[track][courseCode] = {};
    if (!currentUser.customDueDates[track][courseCode][category]) currentUser.customDueDates[track][courseCode][category] = {};
    
    currentUser.customDueDates[track][courseCode][category][itemName] = newDate;
    
    saveUserData();
    
    if (typeof renderUpcomingAssessments === 'function') {
        renderUpcomingAssessments(track);
    }
    
    updateDueDateDisplay(courseCode, category, itemName, newDate, track);
}

function updateDueDateDisplay(courseCode, category, itemName, newDate, track) {
    const inputId = `${courseCode}-${category}-${itemName}`;
    const gradeInput = document.getElementById(inputId);
    
    if (gradeInput) {
        const inputGroup = gradeInput.parentElement;
        const dueDateElement = inputGroup.querySelector('.due-date');
        
        if (dueDateElement) {
            dueDateElement.textContent = `Due: ${formatDueDate(newDate)}`;
            dueDateElement.className = `due-date ${getDueDateClass(newDate)}`;
        }
    }
}

// Course management functions
function renderCourses(track) {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';
    
    Object.entries(courses[track]).forEach(([courseCode, courseData]) => {
        const courseCard = createCourseCard(courseCode, courseData, track);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(courseCode, courseData, track) {
    const card = document.createElement('div');
    card.className = `course-card ${getCourseColorClass(courseCode)}`;
    card.id = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    
    const currentGrade = calculateCourseGrade(courseCode, track);
    const letterGrade = getLetterGrade(currentGrade);
    const gradeQualityClass = getGradeQualityClass(letterGrade);
    
    card.innerHTML = `
        <div class="course-header" onclick="toggleCourseExpansion(event, '${courseCode}', '${track}')">
            <div class="course-info">
                <h3>${courseCode}</h3>
                <p>${courseData.title}</p>
            </div>
            <div class="course-header-right">
                <span class="course-grade-display">${currentGrade.toFixed(1)}%</span>
                <span class="grade-letter ${gradeQualityClass}">${letterGrade}</span>
                <span class="expand-indicator">▼</span>
            </div>
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
    const courseGrades = grades[track]?.[courseCode]?.[category] || {};
    
    return `
        <div class="assessment-group">
            <div class="assessment-header">
                <span class="assessment-title">${category}</span>
                <span class="assessment-weight">${data.weight}%</span>
            </div>
            <div class="assessment-inputs">
                ${data.items.map(item => {
                    const itemName = typeof item === 'object' ? item.name : item;
                    const effectiveDueDate = getEffectiveDueDate(courseCode, category, itemName, track);
                    const currentValue = courseGrades[itemName] || '';
                    
                    const dueDateDisplay = effectiveDueDate ? 
                        `<small class="due-date ${getDueDateClass(effectiveDueDate)}">Due: ${formatDueDate(effectiveDueDate)}</small>
                         <input type="date" 
                                value="${effectiveDueDate}" 
                                class="due-date-input"
                                onchange="updateDueDate('${courseCode}', '${category}', '${itemName}', this.value, '${track}'); event.stopPropagation();"
                                onclick="event.stopPropagation()"
                         />` : '';
                    
                    return `
                        <div class="input-group">
                            <label for="${courseCode}-${category}-${itemName}">${itemName}</label>
                            ${dueDateDisplay}
                            <input 
                                type="number" 
                                id="${courseCode}-${category}-${itemName}"
                                min="0" 
                                max="100" 
                                step="0.1"
                                placeholder="0-100"
                                value="${currentValue}"
                                onchange="updateGrade('${courseCode}', '${category}', '${itemName}', this.value, '${track}')"
                                onclick="event.stopPropagation()"
                            />
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function toggleCourseExpansion(event, courseCode, track) {
    event.stopPropagation();
    event.preventDefault();
    
    const cardId = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    const card = document.getElementById(cardId);
    
    if (!card || !event.target.closest(`#${cardId}`)) return;
    
    card.classList.toggle('expanded');
}

// Due date utility functions
function formatDueDate(dateString) {
    // Use the same local date creation as upcoming-assessments.js
    const date = new Date(dateString + 'T00:00:00'); // This creates a local date
    const now = new Date();
    const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = date - nowLocal;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Also fix the getDueDateClass function to be consistent:
function getDueDateClass(dateString) {
    const date = new Date(dateString + 'T00:00:00'); // Use local date
    const now = new Date();
    const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = date - nowLocal;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'due-soon';
    if (diffDays <= 3) return 'due-this-week';
    return 'due-later';
}
