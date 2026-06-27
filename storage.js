let history = JSON.parse(localStorage.getItem('fikr_history') || '[]');

export function saveSession(session) {
    history.unshift(session);
    localStorage.setItem('fikr_history', JSON.stringify(history));
    // Also IndexedDB if needed
}

export function getHistory() { return history; }

export function loadSettings() {
    const s = JSON.parse(localStorage.getItem('fikr_settings') || '{}');
    document.getElementById('soundCheckbox')?.checked = s.sound !== false;
    document.getElementById('dailyGoal')?.value = s.dailyGoal || 120;
}

export function saveSettings() {
    const settings = {
        sound: document.getElementById('soundCheckbox')?.checked,
        dailyGoal: document.getElementById('dailyGoal')?.value
    };
    localStorage.setItem('fikr_settings', JSON.stringify(settings));
}
