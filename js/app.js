// Main application controller
let selectedTrack = null;
let grades = {};

function selectTrack(track) {
    selectedTrack = track;
    
    // Save track selection
    saveUserData();
    
    // Update button states
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.track-btn.${track}`).classList.add('active');
    
    // Show appropriate dashboard
    document.querySelectorAll('.dashboard').forEach(dashboard => {
        dashboard.classList.remove('active');
    });
    document.getElementById(`${track}-dashboard`).classList.add('active');
    
    // Initialize grades for this track
    if (!grades[track]) {
        grades[track] = {};
        Object.keys(courses[track]).forEach(courseCode => {
            grades[track][courseCode] = {};
        });
    }
    
    // Render courses
    renderCourses(track);
    updateOverallStats(track);
}

// Auto-save data every 30 seconds
setInterval(() => {
    if (currentUser) {
        saveUserData();
    }
}, 30000);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load users and check for existing session
    loadUsersFromStorage();
    
    if (checkExistingSession()) {
        // User has an active session
        showMainApp();
        loadUserData();
    } else {
        // Show login modal
        document.getElementById('login-modal').style.display = 'flex';
        
        // Pre-fill demo credentials for easy testing
        document.getElementById('username').value = 'demo_student';
        document.getElementById('password').value = 'password123';
    }
    
    // Add enter key support for login
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    document.getElementById('reg-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            register();
        }
    });
    
    document.getElementById('full-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            register();
        }
    });
});
