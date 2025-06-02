// Upcoming assessments functionality with dismiss feature

// Dismiss/undismiss assessment functions
function dismissAssessment(courseCode, category, itemName, track) {
    if (!currentUser.dismissedAssessments) {
        currentUser.dismissedAssessments = {};
    }
    if (!currentUser.dismissedAssessments[track]) {
        currentUser.dismissedAssessments[track] = {};
    }
    if (!currentUser.dismissedAssessments[track][courseCode]) {
        currentUser.dismissedAssessments[track][courseCode] = {};
    }
    if (!currentUser.dismissedAssessments[track][courseCode][category]) {
        currentUser.dismissedAssessments[track][courseCode][category] = [];
    }
    
    // Add to dismissed list if not already there
    if (!currentUser.dismissedAssessments[track][courseCode][category].includes(itemName)) {
        currentUser.dismissedAssessments[track][courseCode][category].push(itemName);
    }
    
    // Save and refresh
    saveUserData();
    renderUpcomingAssessments(track);
}

function undismissAssessment(courseCode, category, itemName, track) {
    if (currentUser.dismissedAssessments && 
        currentUser.dismissedAssessments[track] && 
        currentUser.dismissedAssessments[track][courseCode] && 
        currentUser.dismissedAssessments[track][courseCode][category]) {
        
        const index = currentUser.dismissedAssessments[track][courseCode][category].indexOf(itemName);
        if (index > -1) {
            currentUser.dismissedAssessments[track][courseCode][category].splice(index, 1);
        }
    }
    
    // Save and refresh
    saveUserData();
    renderUpcomingAssessments(track);
}

function isAssessmentDismissed(courseCode, category, itemName, track) {
    return currentUser.dismissedAssessments && 
           currentUser.dismissedAssessments[track] && 
           currentUser.dismissedAssessments[track][courseCode] && 
           currentUser.dismissedAssessments[track][courseCode][category] && 
           currentUser.dismissedAssessments[track][courseCode][category].includes(itemName);
}

function toggleShowDismissed(track) {
    const container = document.getElementById(`${track}-upcoming-container`);
    if (!container) return;
    
    // Get current state
    const currentState = container.getAttribute('data-show-dismissed') === 'true';
    
    // Toggle state
    container.setAttribute('data-show-dismissed', !currentState);
    
    // Re-render
    renderUpcomingAssessments(track);
}

function getUpcomingAssessments(track, daysAhead = 14, includeDismissed = false) {
    const now = new Date();
    // Use local date without time for consistent comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);
    
    const upcoming = [];
    
    Object.entries(courses[track]).forEach(([courseCode, courseData]) => {
        Object.entries(courseData.assessments).forEach(([category, data]) => {
            data.items.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                const effectiveDueDate = getEffectiveDueDate(courseCode, category, itemName, track);
                
                if (effectiveDueDate) {
                    // Create date object from date string (local date, no time)
                    const dueDateObj = new Date(effectiveDueDate + 'T00:00:00');
                    
                    // Include items that are due today or in the future, within the time window
                    if (dueDateObj >= today && dueDateObj <= futureDate) {
                        // Check if already completed
                        const isCompleted = grades[track] && 
                                          grades[track][courseCode] && 
                                          grades[track][courseCode][category] && 
                                          grades[track][courseCode][category][itemName] !== null &&
                                          grades[track][courseCode][category][itemName] !== undefined &&
                                          grades[track][courseCode][category][itemName] !== '';
                        
                        // Check if dismissed
                        const isDismissed = isAssessmentDismissed(courseCode, category, itemName, track);
                        
                        // Only include if not dismissed, or if we want to include dismissed items
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
    
    // Sort by due date
    upcoming.sort((a, b) => a.dueDate - b.dueDate);
    
    return upcoming;
}

function getDaysUntilDue(dateString) {
    // Use local dates for consistent calculation
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const dueDate = new Date(dateString + 'T00:00:00');
    const dueDateLocal = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    
    const diffTime = dueDateLocal - todayLocal;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderUpcomingAssessments(track) {
    const container = document.getElementById(`${track}-upcoming-assessments`);
    const upcomingContainer = document.getElementById(`${track}-upcoming-container`);
    
    if (!container) return;
    
    // Check if section was previously collapsed
    const wasCollapsed = upcomingContainer && upcomingContainer.classList.contains('collapsed');
    
    // Check if showing dismissed items
    const showDismissed = upcomingContainer && upcomingContainer.getAttribute('data-show-dismissed') === 'true';
    
    const upcoming = getUpcomingAssessments(track, 14, false); // Active items
    const dismissed = getUpcomingAssessments(track, 14, true).filter(item => item.isDismissed); // Dismissed items
    
    if (upcoming.length === 0 && dismissed.length === 0) {
        container.innerHTML = `
            <div class="upcoming-empty">
                <div class="upcoming-empty-icon">📅</div>
                <p>No upcoming assessments in the next 14 days</p>
                <small>You're all caught up!</small>
            </div>
        `;
        
        // Update header summary
        if (upcomingContainer) {
            const summaryElement = upcomingContainer.querySelector('.upcoming-summary');
            if (summaryElement) {
                summaryElement.innerHTML = '<span class="upcoming-count">All caught up! 🎉</span>';
            }
        }
        return;
    }
    
    let sectionsHtml = '';
    
    // Show active assessments
    if (upcoming.length > 0) {
        // Group by urgency
        const overdue = upcoming.filter(item => item.urgency < 0);
        const today = upcoming.filter(item => item.urgency === 0);
        const thisWeek = upcoming.filter(item => item.urgency > 0 && item.urgency <= 7);
        const later = upcoming.filter(item => item.urgency > 7);
        
        if (overdue.length > 0) {
            sectionsHtml += createUpcomingSection('⚠️ Overdue', overdue, 'overdue');
        }
        
        if (today.length > 0) {
            sectionsHtml += createUpcomingSection('🔥 Due Today', today, 'due-today');
        }
        
        if (thisWeek.length > 0) {
            sectionsHtml += createUpcomingSection('📋 This Week', thisWeek, 'due-this-week');
        }
        
        if (later.length > 0) {
            sectionsHtml += createUpcomingSection('📆 Coming Up', later, 'due-later');
        }
    }
    
    // Show dismissed assessments if requested
    if (showDismissed && dismissed.length > 0) {
        sectionsHtml += createUpcomingSection('👻 Dismissed', dismissed, 'dismissed');
    }
    
    // Update the content
    container.innerHTML = sectionsHtml;
    
    // Update header summary with toggle for dismissed items
    if (upcomingContainer) {
        const totalUpcoming = upcoming.filter(item => !item.isCompleted).length;
        const completedCount = upcoming.filter(item => item.isCompleted).length;
        
        const summaryElement = upcomingContainer.querySelector('.upcoming-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <span class="upcoming-count">${totalUpcoming} pending</span>
                ${completedCount > 0 ? `<span class="completed-count">${completedCount} completed</span>` : ''}
                ${dismissed.length > 0 ? `
                    <button class="toggle-dismissed-btn ${showDismissed ? 'active' : ''}" 
                            onclick="toggleShowDismissed('${track}'); event.stopPropagation();">
                        ${showDismissed ? 'Hide' : 'Show'} ${dismissed.length} dismissed
                    </button>
                ` : ''}
            `;
        }
        
        // Restore collapsed state if it was previously collapsed
        if (wasCollapsed) {
            upcomingContainer.classList.add('collapsed');
        }
    }
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
    
    // Get course color for the border and background
    const courseCodeClean = item.courseCode.replace(/\s/g, '');
    
    // Dismiss/undismiss button
    const dismissButton = item.isDismissed ? 
        `<button class="undismiss-btn" onclick="undismissAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}'); event.stopPropagation();" title="Show this assessment again">
            ↩️
        </button>` :
        `<button class="dismiss-btn" onclick="dismissAssessment('${item.courseCode}', '${item.category}', '${item.itemName}', '${selectedTrack}'); event.stopPropagation();" title="Dismiss this assessment">
            ✕
        </button>`;
    
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
    if (days < 0) {
        return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    } else if (days === 0) {
        return 'Today';
    } else if (days === 1) {
        return 'Tomorrow';
    } else {
        return `${days} days`;
    }
}

function toggleUpcomingAssessments(track) {
    const container = document.getElementById(`${track}-upcoming-container`);
    if (container) {
        container.classList.toggle('collapsed');
        
        // Remove inline transform style to let CSS handle the rotation
        const indicator = container.querySelector('.expand-indicator');
        if (indicator) {
            indicator.style.transform = '';
        }
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
    // Initialize dismissed state
    const container = document.getElementById(`${track}-upcoming-container`);
    if (container && !container.hasAttribute('data-show-dismissed')) {
        container.setAttribute('data-show-dismissed', 'false');
    }
    
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