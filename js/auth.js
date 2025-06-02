// Authentication system with localStorage support
let currentUser = null;
let currentUserSession = null;
let usersDatabase = {};

// Default user structure
const createDefaultUser = (username, password, fullName, track) => ({
    username,
    password,
    fullName,
    track,
    grades: {},
    selectedTrack: track,
    customDueDates: {},
    dismissedAssessments: {}
});

// Ensure user has all required properties
function validateUserData(user) {
    if (!user.customDueDates) user.customDueDates = {};
    if (!user.dismissedAssessments) user.dismissedAssessments = {};
    if (!user.grades) user.grades = {};
    return user;
}

function loadUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('ece_users_database');
        if (storedUsers) {
            usersDatabase = JSON.parse(storedUsers);
        } else {
            usersDatabase = {
                'demo_student': createDefaultUser('demo_student', 'password123', 'Demo Student', 'electrical')
            };
            saveUsersToStorage();
        }
    } catch (e) {
        console.warn('localStorage error, using demo account');
        usersDatabase = {
            'demo_student': createDefaultUser('demo_student', 'password123', 'Demo Student', 'electrical')
        };
    }
    
    // Validate all existing users
    Object.keys(usersDatabase).forEach(username => {
        usersDatabase[username] = validateUserData(usersDatabase[username]);
    });
}

function saveUsersToStorage() {
    try {
        localStorage.setItem('ece_users_database', JSON.stringify(usersDatabase));
    } catch (e) {
        console.warn('Unable to save to localStorage');
    }
}

function checkExistingSession() {
    try {
        const savedSession = localStorage.getItem('ece_current_session');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            if (usersDatabase[sessionData.username]) {
                currentUser = validateUserData(usersDatabase[sessionData.username]);
                currentUserSession = sessionData.username;
                return true;
            }
        }
    } catch (e) {
        console.warn('Unable to restore session');
    }
    return false;
}

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
        currentUser = validateUserData(usersDatabase[username]);
        currentUserSession = username;
        
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
    usersDatabase[username] = createDefaultUser(username, password, fullName, track);
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
    
    // Reset state
    currentUser = null;
    currentUserSession = null;
    selectedTrack = null;
    grades = {};
    
    // Reset UI
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('login-modal').style.display = 'flex';
    
    // Clear forms
    ['username', 'password', 'reg-username', 'reg-password', 'full-name'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    document.getElementById('track-selection').value = '';
    
    // Reset track buttons
    document.querySelectorAll('.track-btn').forEach(btn => btn.classList.remove('active'));
}

function showMainApp() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    
    // Update user display
    document.getElementById('welcome-text').textContent = `Welcome, ${currentUser.fullName}`;
    document.getElementById('user-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();
    
    // Auto-select user's track if they have one
    if (currentUser.track) {
        selectTrack(currentUser.track);
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
    
    // Update user data
    Object.assign(usersDatabase[currentUserSession], {
        grades,
        selectedTrack,
        track: currentUser.track,
        customDueDates: currentUser.customDueDates || {},
        dismissedAssessments: currentUser.dismissedAssessments || {}
    });
    
    saveUsersToStorage();
}

function loadUserData() {
    if (!currentUser) return;
    
    grades = currentUser.grades || {};
    selectedTrack = currentUser.selectedTrack;
    
    validateUserData(currentUser);
    
    if (selectedTrack) {
        selectTrack(selectedTrack);
    }
}