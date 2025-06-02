// Main application controller
let selectedTrack = null;
let grades = {};

function selectTrack(track) {
    selectedTrack = track;
    saveUserData();
    
    // Update button states
    document.querySelectorAll('.track-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.track-btn.${track}`)?.classList.add('active');
    
    // Show dashboard
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
        // Pre-fill demo credentials for easy testing
        document.getElementById('username').value = 'demo_student';
        document.getElementById('password').value = 'password123';
    }
    
    addKeyboardListeners();
});