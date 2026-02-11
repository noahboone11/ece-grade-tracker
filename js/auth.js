// ==================== Storage & User =====================
// Single-user, browser-local. No passwords, no server.
// Each person who opens the app has their own isolated localStorage.

let currentUser = null;

function createNewUser(name) {
    return {
        name,
        grades: {},
        customDueDates: {},
        dismissedAssessments: {}
    };
}

function validateUser(user) {
    if (!user.customDueDates)     user.customDueDates     = {};
    if (!user.dismissedAssessments) user.dismissedAssessments = {};
    if (!user.grades)             user.grades             = {};
    return user;
}

// ==================== Persistence ====================

function loadFromStorage() {
    try {
        const stored = localStorage.getItem('ece_grade_data');
        if (stored) {
            currentUser = validateUser(JSON.parse(stored));
            return true;
        }
    } catch (e) {
        console.warn('Failed to load saved data');
    }
    return false;
}

function saveUserData() {
    if (!currentUser) return;
    currentUser.grades = grades; // sync from app.js global
    try {
        localStorage.setItem('ece_grade_data', JSON.stringify(currentUser));
    } catch (e) {
        console.warn('Failed to save data');
    }
}

// Auto-save every 30 seconds
setInterval(() => { if (currentUser) saveUserData(); }, 30000);

// ==================== First-Visit Setup ====================

function setupUser() {
    const input = document.getElementById('display-name');
    const name = input?.value.trim();
    if (!name) { input?.focus(); return; }

    currentUser = createNewUser(name);
    saveUserData();
    showMainApp();
    initializeApp();
}

// ==================== UI ====================

function showMainApp() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-avatar').textContent =
        currentUser.name.charAt(0).toUpperCase();
    document.getElementById('welcome-text').textContent = currentUser.name;
}

// ==================== Reset ====================

function logout() {
    if (!confirm('This will clear all your grade data from this browser. Are you sure?')) return;

    localStorage.removeItem('ece_grade_data');
    currentUser = null;
    grades = {};

    document.getElementById('user-info').style.display = 'none';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('display-name').value = '';
    document.getElementById('display-name').focus();
}

// ==================== Export / Import ====================

function exportData() {
    if (!currentUser) return;
    saveUserData(); // flush latest state

    const json = JSON.stringify(currentUser, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href     = url;
    a.download = `ece-grades-${currentUser.name.replace(/\s+/g, '-')}-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!data.name) throw new Error('Missing name field');

                currentUser = validateUser(data);
                saveUserData();

                grades = JSON.parse(JSON.stringify(currentUser.grades || {}));
                showMainApp();
                initializeApp();

                showToast('Data imported successfully');
            } catch (err) {
                showToast('Invalid file — please use a valid export', true);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ==================== Toast notification ====================

function showToast(message, isError = false) {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `toast ${isError ? 'toast--error' : 'toast--success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
