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
    
    // Render upcoming assessments
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

// Override the showMainApp function from auth.js to include upcoming assessments
function showMainApp() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    
    // Update user display
    document.getElementById('welcome-text').textContent = `Welcome, ${currentUser.fullName}`;
    document.getElementById('user-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();
    
    // Auto-select user's track and show dashboard
    if (currentUser.track) {
        selectedTrack = currentUser.track;
        
        // Show appropriate dashboard directly
        document.querySelectorAll('.dashboard').forEach(dashboard => {
            dashboard.classList.remove('active');
        });
        document.getElementById(`${currentUser.track}-dashboard`).classList.add('active');
        
        // Initialize grades for this track
        if (!grades[currentUser.track]) {
            grades[currentUser.track] = {};
            Object.keys(courses[currentUser.track]).forEach(courseCode => {
                grades[currentUser.track][courseCode] = {};
            });
        }
        
        // Render courses
        renderCourses(currentUser.track);
        updateOverallStats(currentUser.track);
        
        // Initialize upcoming assessments
        if (typeof updateDashboardWithUpcoming === 'function') {
            updateDashboardWithUpcoming(currentUser.track);
        }
    }
}