// Authentication system
let currentUser = null;
let currentUserSession = null;

// In-memory storage (since localStorage isn't available in Claude.ai)
let usersDatabase = {
    'demo_student': {
        username: 'demo_student',
        password: 'password123',
        fullName: 'Demo Student',
        track: 'electrical',
        grades: {},
        selectedTrack: 'electrical'
    }
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    if (usersDatabase[username] && usersDatabase[username].password === password) {
        currentUser = usersDatabase[username];
        currentUserSession = username;
        showMainApp();
        loadUserData();
    } else {
        alert('Invalid username or password\n\nTry demo account:\nUsername: demo_student\nPassword: password123');
    }
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const fullName = document.getElementById('full-name').value;
    const track = document.getElementById('track-selection').value;
    
    if (!username || !password || !fullName || !track) {
        alert('Please fill in all fields including your ECE track');
        return;
    }
    
    if (usersDatabase[username]) {
        alert('Username already exists');
        return;
    }
    
    // Create new user
    usersDatabase[username] = {
        username: username,
        password: password,
        fullName: fullName,
        track: track,
        grades: {},
        selectedTrack: track
    };
    
    // Auto-login
    currentUser = usersDatabase[username];
    currentUserSession = username;
    showMainApp();
    loadUserData();
}

function logout() {
    saveUserData();
    currentUser = null;
    currentUserSession = null;
    selectedTrack = null;
    grades = {};
    
    // Hide main content and dashboards
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    document.querySelectorAll('.dashboard').forEach(d => d.classList.remove('active'));
    
    // Show login modal
    document.getElementById('login-modal').style.display = 'flex';
    
    // Reset track buttons
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('full-name').value = '';
    document.getElementById('track-selection').value = '';
}

function showMainApp() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'none'; // Hide track selector
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
    }
}

function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function saveUserData() {
    if (!currentUser || !currentUserSession) return;
    
    usersDatabase[currentUserSession].grades = grades;
    usersDatabase[currentUserSession].selectedTrack = selectedTrack;
    usersDatabase[currentUserSession].track = currentUser.track; // Preserve original track selection
}

function loadUserData() {
    if (!currentUser) return;
    
    grades = currentUser.grades || {};
    selectedTrack = currentUser.selectedTrack;
    
    if (selectedTrack) {
        selectTrack(selectedTrack);
    }
}