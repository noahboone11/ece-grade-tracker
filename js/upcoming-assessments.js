// Upcoming assessments functionality
function getUpcomingAssessments(track, daysAhead = 14) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);
    
    const upcoming = [];
    
    Object.entries(courses[track]).forEach(([courseCode, courseData]) => {
        Object.entries(courseData.assessments).forEach(([category, data]) => {
            data.items.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                const dueDate = typeof item === 'object' ? item.dueDate : null;
                
                if (dueDate) {
                    const dueDateObj = new Date(dueDate);
                    if (dueDateObj >= now && dueDateObj <= futureDate) {
                        // Check if already completed
                        const isCompleted = grades[track] && 
                                          grades[track][courseCode] && 
                                          grades[track][courseCode][category] && 
                                          grades[track][courseCode][category][itemName] !== null &&
                                          grades[track][courseCode][category][itemName] !== undefined &&
                                          grades[track][courseCode][category][itemName] !== '';
                        
                        upcoming.push({
                            courseCode,
                            courseTitle: courseData.title,
                            category,
                            itemName,
                            dueDate: dueDateObj,
                            dueDateString: dueDate,
                            weight: data.weight,
                            isCompleted,
                            urgency: getDaysUntilDue(dueDate)
                        });
                    }
                }
            });
        });
    });
    
    // Sort by due date
    upcoming.sort((a, b) => a.dueDate - b.dueDate);
    
    return upcoming;
}

function getDaysUntilDue(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderUpcomingAssessments(track) {
    const upcoming = getUpcomingAssessments(track);
    const container = document.getElementById(`${track}-upcoming-assessments`);
    
    if (!container) return;
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="upcoming-empty">
                <div class="upcoming-empty-icon">📅</div>
                <p>No upcoming assessments in the next 14 days</p>
                <small>You're all caught up!</small>
            </div>
        `;
        return;
    }
    
    // Group by urgency
    const overdue = upcoming.filter(item => item.urgency < 0);
    const today = upcoming.filter(item => item.urgency === 0);
    const thisWeek = upcoming.filter(item => item.urgency > 0 && item.urgency <= 7);
    const later = upcoming.filter(item => item.urgency > 7);
    
    let html = '';
    
    if (overdue.length > 0) {
        html += createUpcomingSection('⚠️ Overdue', overdue, 'overdue');
    }
    
    if (today.length > 0) {
        html += createUpcomingSection('🔥 Due Today', today, 'due-today');
    }
    
    if (thisWeek.length > 0) {
        html += createUpcomingSection('📋 This Week', thisWeek, 'due-this-week');
    }
    
    if (later.length > 0) {
        html += createUpcomingSection('📆 Coming Up', later, 'due-later');
    }
    
    container.innerHTML = html;
}

function createUpcomingSection(title, items, className) {
    return `
        <div class="upcoming-section ${className}">
            <h4 class="upcoming-section-title">${title}</h4>
            <div class="upcoming-items">
                ${items.map(item => createUpcomingItem(item)).join('')}
            </div>
        </div>
    `;
}

function createUpcomingItem(item) {
    const urgencyText = getUrgencyText(item.urgency);
    const completedClass = item.isCompleted ? 'completed' : '';
    const completedIcon = item.isCompleted ? '✅' : '';
    
    return `
        <div class="upcoming-item ${completedClass}" onclick="jumpToAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}')">
            <div class="upcoming-item-header">
                <div class="upcoming-item-course">${item.courseCode}</div>
                <div class="upcoming-item-urgency">${urgencyText} ${completedIcon}</div>
            </div>
            <div class="upcoming-item-title">${item.itemName}</div>
            <div class="upcoming-item-details">
                <span class="upcoming-item-category">${item.category}</span>
                <span class="upcoming-item-weight">${item.weight}%</span>
            </div>
        </div>
    `;
}

function getUrgencyText(days) {
    if (days < 0) {
        return `${Math.abs(days)} days ago`;
    } else if (days === 0) {
        return 'Today';
    } else if (days === 1) {
        return 'Tomorrow';
    } else {
        return `${days} days`;
    }
}

function jumpToAssessment(courseCode, category, itemName, track) {
    // Expand the course card if not already expanded
    const cardId = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    const card = document.getElementById(cardId);
    
    if (card && !card.classList.contains('expanded')) {
        card.classList.add('expanded');
    }
    
    // Scroll to the course card
    if (card) {
        card.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Highlight the specific input temporarily
        setTimeout(() => {
            const inputId = `${courseCode}-${category}-${itemName}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.5)';
                setTimeout(() => {
                    input.style.boxShadow = '';
                }, 2000);
            }
        }, 500);
    }
}

// Update the main selectTrack function to include upcoming assessments
function updateDashboardWithUpcoming(track) {
    // Render upcoming assessments
    renderUpcomingAssessments(track);
    
    // Update upcoming assessments every minute
    clearInterval(window.upcomingAssessmentsInterval);
    window.upcomingAssessmentsInterval = setInterval(() => {
        if (selectedTrack === track) {
            renderUpcomingAssessments(track);
        }
    }, 60000); // Update every minute
}

// Add event listener for when grades are updated to refresh upcoming assessments
function onGradeUpdate(track) {
    // Refresh upcoming assessments when grades change
    setTimeout(() => {
        renderUpcomingAssessments(track);
    }, 100);
}