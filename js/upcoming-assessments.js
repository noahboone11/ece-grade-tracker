// Upcoming assessments functionality with dismiss feature

// Assessment management functions
function manageAssessmentDismissal(courseCode, category, itemName, track, dismiss = true) {
    // Initialize nested structure
    if (!currentUser.dismissedAssessments) currentUser.dismissedAssessments = {};
    if (!currentUser.dismissedAssessments[track]) currentUser.dismissedAssessments[track] = {};
    if (!currentUser.dismissedAssessments[track][courseCode]) currentUser.dismissedAssessments[track][courseCode] = {};
    if (!currentUser.dismissedAssessments[track][courseCode][category]) currentUser.dismissedAssessments[track][courseCode][category] = [];
    
    const dismissedList = currentUser.dismissedAssessments[track][courseCode][category];
    const index = dismissedList.indexOf(itemName);
    
    if (dismiss && index === -1) {
        dismissedList.push(itemName);
    } else if (!dismiss && index > -1) {
        dismissedList.splice(index, 1);
    }
    
    saveUserData();
    renderUpcomingAssessments(track);
}

function dismissAssessment(courseCode, category, itemName, track) {
    manageAssessmentDismissal(courseCode, category, itemName, track, true);
}

function undismissAssessment(courseCode, category, itemName, track) {
    manageAssessmentDismissal(courseCode, category, itemName, track, false);
}

function isAssessmentDismissed(courseCode, category, itemName, track) {
    return currentUser.dismissedAssessments?.[track]?.[courseCode]?.[category]?.includes(itemName) || false;
}

function toggleShowDismissed(track) {
    const container = document.getElementById('upcoming-container');
    if (!container) return;
    
    const currentState = container.getAttribute('data-show-dismissed') === 'true';
    container.setAttribute('data-show-dismissed', !currentState);
    renderUpcomingAssessments(track);
}

// Date utility functions
function createLocalDate(dateString) {
    return new Date(dateString + 'T00:00:00');
}

function getDaysUntilDue(dateString) {
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDateLocal = createLocalDate(dateString);
    
    const diffTime = dueDateLocal - todayLocal;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getUpcomingAssessments(track, daysAhead = 14, includeDismissed = false) {
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const futureDate = new Date(todayLocal);
    futureDate.setDate(todayLocal.getDate() + daysAhead);
    
    const upcoming = [];
    
    Object.entries(courses[track]).forEach(([courseCode, courseData]) => {
        Object.entries(courseData.assessments).forEach(([category, data]) => {
            data.items.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                const effectiveDueDate = getEffectiveDueDate(courseCode, category, itemName, track);
                
                if (effectiveDueDate) {
                    const dueDateObj = createLocalDate(effectiveDueDate);
                    
                    if (dueDateObj >= todayLocal && dueDateObj <= futureDate) {
                        const isCompleted = grades[track]?.[courseCode]?.[category]?.[itemName] !== null &&
                                          grades[track]?.[courseCode]?.[category]?.[itemName] !== undefined &&
                                          grades[track]?.[courseCode]?.[category]?.[itemName] !== '';
                        
                        const isDismissed = isAssessmentDismissed(courseCode, category, itemName, track);
                        
                        if (!isDismissed || includeDismissed) {
                            upcoming.push({
                                courseCode,
                                courseTitle: courseData.title,
                                category,
                                itemName,
                                dueDate: dueDateObj,
                                dueDateString: effectiveDueDate,
                                weight: data.weight,
                                isCompleted,
                                isDismissed,
                                urgency: getDaysUntilDue(effectiveDueDate)
                            });
                        }
                    }
                }
            });
        });
    });
    
    return upcoming.sort((a, b) => a.dueDate - b.dueDate);
}

function renderUpcomingAssessments(track) {
    const container = document.getElementById('upcoming-assessments');
    const upcomingContainer = document.getElementById('upcoming-container');
    
    if (!container) return;
    
    const wasCollapsed = upcomingContainer?.classList.contains('collapsed');
    const showDismissed = upcomingContainer?.getAttribute('data-show-dismissed') === 'true';
    
    const upcoming = getUpcomingAssessments(track, 14, false);
    const dismissed = getUpcomingAssessments(track, 14, true).filter(item => item.isDismissed);
    
    if (upcoming.length === 0 && dismissed.length === 0) {
        container.innerHTML = `
            <div class="upcoming-empty">
                <div class="upcoming-empty-icon">📅</div>
                <p>No upcoming assessments in the next 14 days</p>
                <small>You're all caught up!</small>
            </div>
        `;
        updateUpcomingSummary(upcomingContainer, 0, 0, []);
        return;
    }
    
    let sectionsHtml = '';
    
    // Group active assessments by urgency
    if (upcoming.length > 0) {
        const groups = [
            { items: upcoming.filter(item => item.urgency < 0), title: '⚠️ Overdue', class: 'overdue' },
            { items: upcoming.filter(item => item.urgency === 0), title: '🔥 Due Today', class: 'due-today' },
            { items: upcoming.filter(item => item.urgency > 0 && item.urgency <= 7), title: '📋 This Week', class: 'due-this-week' },
            { items: upcoming.filter(item => item.urgency > 7), title: '📆 Coming Up', class: 'due-later' }
        ];
        
        groups.forEach(group => {
            if (group.items.length > 0) {
                sectionsHtml += createUpcomingSection(group.title, group.items, group.class);
            }
        });
    }
    
    // Show dismissed assessments if requested
    if (showDismissed && dismissed.length > 0) {
        sectionsHtml += createUpcomingSection('👻 Dismissed', dismissed, 'dismissed');
    }
    
    container.innerHTML = sectionsHtml;
    
    // Update summary
    const totalUpcoming = upcoming.filter(item => !item.isCompleted).length;
    const completedCount = upcoming.filter(item => item.isCompleted).length;
    updateUpcomingSummary(upcomingContainer, totalUpcoming, completedCount, dismissed, track, showDismissed);
    
    // Restore collapsed state
    if (wasCollapsed) {
        upcomingContainer?.classList.add('collapsed');
    }
}

function updateUpcomingSummary(container, totalUpcoming, completedCount, dismissed, track, showDismissed) {
    if (!container) return;
    
    const summaryElement = container.querySelector('.upcoming-summary');
    if (!summaryElement) return;
    
    if (totalUpcoming === 0 && completedCount === 0 && dismissed.length === 0) {
        summaryElement.innerHTML = '<span class="upcoming-count">All caught up! 🎉</span>';
        return;
    }
    
    let summaryHtml = `<span class="upcoming-count">${totalUpcoming} pending</span>`;
    
    if (completedCount > 0) {
        summaryHtml += `<span class="completed-count">${completedCount} completed</span>`;
    }
    
    if (dismissed.length > 0 && track) {
        summaryHtml += `
            <button class="toggle-dismissed-btn ${showDismissed ? 'active' : ''}" 
                    onclick="toggleShowDismissed('${track}'); event.stopPropagation();">
                ${showDismissed ? 'Hide' : 'Show'} ${dismissed.length} dismissed
            </button>
        `;
    }
    
    summaryElement.innerHTML = summaryHtml;
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
    const dismissedClass = item.isDismissed ? 'dismissed' : '';
    const completedIcon = item.isCompleted ? '✅' : '';
    const courseCodeClean = item.courseCode.replace(/\s/g, '');
    
    const dismissButton = item.isDismissed ? 
        `<button class="undismiss-btn" onclick="undismissAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}'); event.stopPropagation();" title="Show this assessment again">↩️</button>` :
        `<button class="dismiss-btn" onclick="dismissAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}'); event.stopPropagation();" title="Dismiss this assessment">✕</button>`;
    
    return `
        <div class="upcoming-item ${completedClass} ${dismissedClass}" 
             data-course="${courseCodeClean}"
             onclick="jumpToAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}')">
            <div class="upcoming-item-header">
                <div class="upcoming-item-course">${item.courseCode}</div>
                <div class="upcoming-item-actions">
                    <div class="upcoming-item-urgency">${urgencyText} ${completedIcon}</div>
                    ${dismissButton}
                </div>
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
    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
}

function toggleUpcomingAssessments() {
    const container = document.getElementById('upcoming-container');
    if (container) {
        container.classList.toggle('collapsed');
    }
}

function jumpToAssessment(courseCode, category, itemName, track) {
    const cardId = `course-${courseCode.replace(/\s/g, '-')}-${track}`;
    const card = document.getElementById(cardId);
    
    if (card && !card.classList.contains('expanded')) {
        card.classList.add('expanded');
    }
    
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            const inputId = `${courseCode}-${category}-${itemName}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.5)';
                setTimeout(() => input.style.boxShadow = '', 2000);
            }
        }, 500);
    }
}

function updateDashboardWithUpcoming(track) {
    const container = document.getElementById('upcoming-container');
    if (container && !container.hasAttribute('data-show-dismissed')) {
        container.setAttribute('data-show-dismissed', 'false');
    }
    
    renderUpcomingAssessments(track);
    
    // Update every minute
    clearInterval(window.upcomingAssessmentsInterval);
    window.upcomingAssessmentsInterval = setInterval(() => {
        if (selectedTrack === track) {
            renderUpcomingAssessments(track);
        }
    }, 60000);
}

function onGradeUpdate(track) {
    setTimeout(() => renderUpcomingAssessments(track), 100);
}