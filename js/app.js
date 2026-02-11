// ==================== App Controller ====================
let selectedTrack = 'computer';
let grades = {};

function selectTrack(track) {
    selectedTrack = track;

    if (!grades[track]) {
        grades[track] = {};
        Object.keys(courses[track]).forEach(courseCode => {
            grades[track][courseCode] = {};
        });
    }

    document.getElementById('dashboard').classList.add('active');
    renderCourses(track);
    updateOverallStats(track);

    if (typeof updateDashboardWithUpcoming === 'function') {
        updateDashboardWithUpcoming(track);
    }
}

function initializeApp() {
    grades = JSON.parse(JSON.stringify(currentUser.grades || {}));

    if (!grades['computer']) {
        grades['computer'] = {};
        Object.keys(courses['computer']).forEach(courseCode => {
            grades['computer'][courseCode] = {};
        });
    }

    selectTrack('computer');
}

// ==================== Init ====================

document.addEventListener('DOMContentLoaded', () => {
    if (loadFromStorage()) {
        showMainApp();
        initializeApp();
    } else {
        document.getElementById('login-modal').style.display = 'flex';
    }

    // Enter key on name field
    const nameInput = document.getElementById('display-name');
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') setupUser();
        });
    }
});
