// ==================== ECE TERM 5 - COMPUTER ENGINEERING ====================
// Winter 2026 - All 5 courses
// To add a new course: add a new entry to the courses.computer object below.
// Color fields (color, colorLight, colorDark) are required for theming.

const courses = {
    computer: {
        'ECE 5100': {
            title: 'Probability and Random Processes',
            color: '#8e44ad',
            colorLight: '#e8daef',
            colorDark: '#6c3483',
            assessments: {
                'Assignments': {
                    weight: 15,
                    items: [
                        { name: 'Assignment 1', dueDate: '2026-02-02' },
                        { name: 'Assignment 2', dueDate: '2026-03-02' },
                        { name: 'Assignment 3', dueDate: '2026-03-30' }
                    ]
                },
                'Midterms': {
                    weight: 35,
                    items: [
                        { name: 'Midterm 1', dueDate: '2026-02-18' },
                        { name: 'Midterm 2', dueDate: '2026-03-18' }
                    ]
                },
                'Final': {
                    weight: 50,
                    items: [{ name: 'Final Exam', dueDate: '2026-04-25' }]
                }
            }
        },
        'ENGI 5200': {
            title: 'Control Systems I',
            color: '#16a085',
            colorLight: '#d0ece7',
            colorDark: '#138d75',
            assessments: {
                'Assignments': {
                    weight: 8,
                    items: [
                        { name: 'Assignment 1', dueDate: '2026-01-26' },
                        { name: 'Assignment 2', dueDate: '2026-02-09' },
                        { name: 'Assignment 3', dueDate: '2026-02-23' },
                        { name: 'Assignment 4', dueDate: '2026-03-16' }
                    ]
                },
                'Midterm Test': {
                    weight: 26,
                    items: [{ name: 'Midterm Test', dueDate: '2026-02-16' }]
                },
                'Labs': {
                    weight: 16,
                    items: [
                        { name: 'Lab 1', dueDate: '2026-01-27' },
                        { name: 'Lab 2', dueDate: '2026-02-10' },
                        { name: 'Lab 3', dueDate: '2026-03-03' },
                        { name: 'Lab 4', dueDate: '2026-03-17' }
                    ]
                },
                'Final': {
                    weight: 50,
                    items: [{ name: 'Final Exam', dueDate: '2026-04-25' }]
                }
            }
        },
        'ECE 5500': {
            title: 'Digital Systems',
            color: '#d35400',
            colorLight: '#f5cba7',
            colorDark: '#a04000',
            assessments: {
                'Labs': {
                    weight: 20,
                    items: [
                        { name: 'Lab 1 Report', dueDate: '2026-01-27' },
                        { name: 'Lab 2 Report', dueDate: '2026-02-03' },
                        { name: 'Lab 3 Report', dueDate: '2026-02-10' },
                        { name: 'Lab 4 Report', dueDate: '2026-02-17' },
                        { name: 'Lab 5 Report', dueDate: '2026-02-24' },
                        { name: 'Lab 6 Report', dueDate: '2026-03-03' }
                    ]
                },
                'Project': {
                    weight: 10,
                    items: [{ name: 'Course Project', dueDate: '2026-03-24' }]
                },
                'Mid-term Tests': {
                    weight: 20,
                    items: [
                        { name: 'Midterm Test 1', dueDate: '2026-02-10' },
                        { name: 'Midterm Test 2', dueDate: '2026-03-19' }
                    ]
                },
                'Final': {
                    weight: 50,
                    items: [{ name: 'Final Exam', dueDate: '2026-04-25' }]
                }
            }
        },
        'ECE 5010': {
            title: 'Software Design',
            color: '#c0392b',
            colorLight: '#f5b7b1',
            colorDark: '#922b21',
            assessments: {
                'Assignments': {
                    weight: 10,
                    items: [
                        { name: 'Assignment 1', dueDate: '2026-01-19' },
                        { name: 'Assignment 2', dueDate: '2026-02-02' }
                    ]
                },
                'Project': {
                    weight: 65,
                    items: [
                        { name: 'Proposal', dueDate: '2026-01-26' },
                        { name: 'Proposal Review Meeting', dueDate: '2026-01-29' },
                        { name: 'Requirements Presentation', dueDate: '2026-02-12' },
                        { name: 'Design Report', dueDate: '2026-03-05' },
                        { name: 'Interim Demo', dueDate: '2026-03-18' },
                        { name: 'Final Code Submission', dueDate: '2026-03-31' },
                        { name: 'Final Presentation', dueDate: '2026-04-02' }
                    ]
                },
                'Mid-term Exam': {
                    weight: 25,
                    items: [{ name: 'Midterm Exam', dueDate: '2026-02-20' }]
                }
            }
        },
        'ECE 5400': {
            title: 'Algorithms: Correctness & Complexity',
            color: '#2980b9',
            colorLight: '#d6eaf8',
            colorDark: '#1f618d',
            assessments: {
                'Assignments': {
                    weight: 35,
                    items: [
                        { name: 'Assignment 1', dueDate: '2026-01-27' },
                        { name: 'Assignment 2', dueDate: '2026-02-10' },
                        { name: 'Assignment 3', dueDate: '2026-02-20' },
                        { name: 'Assignment 4', dueDate: '2026-03-17' },
                        { name: 'Assignment 5', dueDate: '2026-04-02' }
                    ]
                },
                'Midterm': {
                    weight: 25,
                    items: [{ name: 'Midterm Test', dueDate: '2026-03-10' }]
                },
                'Final': {
                    weight: 40,
                    items: [{ name: 'Final Exam', dueDate: '2026-04-25' }]
                }
            }
        }
    }
    // To add a new track (e.g. electrical), define it here:
    // electrical: {
    //     'ECE 5XXX': {
    //         title: 'Course Name',
    //         color: '#hex', colorLight: '#hex', colorDark: '#hex',
    //         assessments: { ... }
    //     }
    // }
};

// ==================== Utility ====================

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

// ==================== Course Rendering ====================

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
    card.className = 'course-card';
    card.id = `course-${courseCode.replace(/\s/g, '-')}-${track}`;

    // Inject colors from the course object — no CSS class needed per course
    if (courseData.color) {
        card.style.setProperty('--course-color', courseData.color);
        card.style.setProperty('--course-light', courseData.colorLight);
        card.style.setProperty('--course-dark', courseData.colorDark);
    }

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
                                oninput="updateGradeData('${courseCode}', '${category}', '${itemName}', this.value, '${track}')"
                                onblur="updateGrade('${courseCode}', '${category}', '${itemName}', this.value, '${track}')"
                                onkeydown="if(event.key==='Enter'){this.blur(); updateGrade('${courseCode}', '${category}', '${itemName}', this.value, '${track}');}"
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

// ==================== Due Date Utilities ====================

function formatDueDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
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

function getDueDateClass(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const now = new Date();
    const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = date - nowLocal;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'due-soon';
    if (diffDays <= 3) return 'due-this-week';
    return 'due-later';
}
