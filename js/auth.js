// Authentication system with localStorage support
let currentUser = null;
let currentUserSession = null;

// Initialize with localStorage data or fallback to in-memory
let usersDatabase = {};

// Load existing users from localStorage
function loadUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('ece_users_database');
        if (storedUsers) {
            usersDatabase = JSON.parse(storedUsers);
        } else {
            // Set up demo account if no users exist
            usersDatabase = {
                'demo_student': {
                    username: 'demo_student',
                    password: 'password123',
                    fullName: 'Demo Student',
                    track: 'electrical',
                    grades: {},
                    selectedTrack: 'electrical',
                    customDueDates: {},
                    dismissedAssessments: {}
                }
            };
            saveUsersToStorage();
        }
    } catch (e) {
        // Fallback to demo account if localStorage fails
        usersDatabase = {
            'demo_student': {
                username: 'demo_student',
                password: 'password123',
                fullName: 'Demo Student',
                track: 'electrical',
                grades: {},
                selectedTrack: 'electrical',
                customDueDates: {},
                dismissedAssessments: {}
            }
        };
    }
    
    // Ensure all existing users have required properties
    Object.keys(usersDatabase).forEach(username => {
        if (!usersDatabase[username].customDueDates) {
            usersDatabase[username].customDueDates = {};
        }
        if (!usersDatabase[username].dismissedAssessments) {
            usersDatabase[username].dismissedAssessments = {};
        }
    });
}

// Save users to localStorage
function saveUsersToStorage() {
    try {
        localStorage.setItem('ece_users_database', JSON.stringify(usersDatabase));
    } catch (e) {
        console.warn('Unable to save to localStorage');
    }
}

// Check for existing session
function checkExistingSession() {
    try {
        const savedSession = localStorage.getItem('ece_current_session');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            if (usersDatabase[sessionData.username]) {
                currentUser = usersDatabase[sessionData.username];
                currentUserSession = sessionData.username;
                
                // Ensure required properties exist
                if (!currentUser.customDueDates) {
                    currentUser.customDueDates = {};
                }
                if (!currentUser.dismissedAssessments) {
                    currentUser.dismissedAssessments = {};
                }
                
                return true;
            }
        }
    } catch (e) {
        console.warn('Unable to restore session');
    }
    return false;
}

// Save current session
function saveCurrentSession() {
    try {
        if (currentUserSession) {
            localStorage.setItem('ece_current_session', JSON.stringify({
                username: currentUserSession,
                timestamp: new Date().toISOString()
            }));
        }
    } catch (e) {
        console.warn('Unable to save session');
    }
}

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
        
        // Ensure required properties exist
        if (!currentUser.customDueDates) {
            currentUser.customDueDates = {};
        }
        if (!currentUser.dismissedAssessments) {
            currentUser.dismissedAssessments = {};
        }
        
        saveCurrentSession();
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
        selectedTrack: track,
        customDueDates: {},
        dismissedAssessments: {}
    };
    
    // Save to storage
    saveUsersToStorage();
    
    // Auto-login
    currentUser = usersDatabase[username];
    currentUserSession = username;
    saveCurrentSession();
    showMainApp();
    loadUserData();
}

function logout() {
    saveUserData();
    
    // Clear session
    try {
        localStorage.removeItem('ece_current_session');
    } catch (e) {
        console.warn('Unable to clear session');
    }
    
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
    usersDatabase[currentUserSession].track = currentUser.track;
    
    // Save custom due dates
    if (!usersDatabase[currentUserSession].customDueDates) {
        usersDatabase[currentUserSession].customDueDates = {};
    }
    usersDatabase[currentUserSession].customDueDates = currentUser.customDueDates || {};
    
    // Save dismissed assessments
    if (!usersDatabase[currentUserSession].dismissedAssessments) {
        usersDatabase[currentUserSession].dismissedAssessments = {};
    }
    usersDatabase[currentUserSession].dismissedAssessments = currentUser.dismissedAssessments || {};
    
    // Save to localStorage
    saveUsersToStorage();
}

function loadUserData() {
    if (!currentUser) return;
    
    grades = currentUser.grades || {};
    selectedTrack = currentUser.selectedTrack;
    
    // Load custom due dates
    if (!currentUser.customDueDates) {
        currentUser.customDueDates = {};
    }
    
    // Load dismissed assessments
    if (!currentUser.dismissedAssessments) {
        currentUser.dismissedAssessments = {};
    }
    
    if (selectedTrack) {
        selectTrack(selectedTrack);
    }
}