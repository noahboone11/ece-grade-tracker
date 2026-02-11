// Main application controller - ECE Term 5 Computer Engineering
let selectedTrack = 'computer'; // Fixed to computer for now
let grades = {};

function selectTrack(track) {
    selectedTrack = track;
    saveUserData();
    
    // Show dashboard
    document.getElementById('track-selector').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    
    // Initialize grades for this track
    if (!grades[track]) {
        grades[track] = {};
        Object.keys(courses[track]).forEach(courseCode => {
            grades[track][courseCode] = {};
        });
    }
    
    // Render content
    renderCourses(track);
    updateOverallStats(track);
    
    if (typeof updateDashboardWithUpcoming === 'function') {
        updateDashboardWithUpcoming(track);
    }
}

// Auto-save data every 30 seconds
setInterval(() => {
    if (currentUser) {
        saveUserData();
    }
}, 30000);

// Add keyboard event listeners for forms
function addKeyboardListeners() {
    const addEnterListener = (id, callback) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') callback();
            });
        }
    };
    
    addEnterListener('password', login);
    addEnterListener('reg-password', register);
    addEnterListener('full-name', register);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadUsersFromStorage();
    
    if (checkExistingSession()) {
        showMainApp();
        loadUserData();
    } else {
        document.getElementById('login-modal').style.display = 'flex';
    }
    
    addKeyboardListeners();
});