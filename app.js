import { startMode, stopTimer, getCurrentMode } from './timer.js';
import { renderAnalytics } from './analytics.js';
import { loadSettings, saveSettings } from './storage.js';
import { initBreathingControls } from './breathing.js';

const MODES = [
    { id:'pomodoro', name:'Pomodoro', icon:'🍅', defaults:{focus:25,break:5,rounds:4} },
    { id:'deepwork', name:'Deep Work', icon:'🧠', defaults:{focus:90,break:15} },
    { id:'breathing', name:'Breathing', icon:'🧘', defaults:{inhale:4,hold:4,exhale:4,hold2:4,cycles:5} },
    { id:'interval', name:'Interval', icon:'🔄', defaults:{focus:30,break:10,rounds:6} },
    { id:'study', name:'Study', icon:'📚', defaults:{focus:50,break:10} },
    { id:'exam', name:'Exam', icon:'📝', defaults:{questions:20,time:60} },
    { id:'reading', name:'Reading', icon:'📖', defaults:{pages:30,time:30} },
    { id:'coding', name:'Coding', icon:'💻', defaults:{focus:45} },
    { id:'workout', name:'Workout', icon:'💪', defaults:{exercise:45,rest:15,rounds:8} },
    { id:'custom', name:'Custom', icon:'⚙️', defaults:{focus:30,break:5,rounds:4} },
    { id:'stopwatch', name:'Stopwatch', icon:'⏱️', defaults:{} },
    { id:'countdown', name:'Countdown', icon:'⏲️', defaults:{focus:30} }
];

let currentView = 'home';
const main = document.getElementById('mainContent');
const navButtons = document.querySelectorAll('.nav-item');

// View templates
function renderView(view) {
    switch(view) {
        case 'home': return renderHome();
        case 'timer': return renderTimer();
        case 'analytics': return renderAnalytics();
        case 'settings': return renderSettings();
        default: return '';
    }
}

function renderHome() {
    return `
        <div class="view active" id="homeView">
            <h2>Choose Your Mode</h2>
            <div class="card-grid" id="modeGrid"></div>
        </div>`;
}

function renderTimer() {
    return `
        <div class="view active" id="timerView">
            <div id="timerModeLabel"></div>
            <div id="roundInfo"></div>
            <div class="breathing-phase" id="breathingPhase"></div>
            <div class="timer-3d-container">
                <div class="circular-timer">
                    <svg class="timer-svg" viewBox="0 0 200 200">
                        <circle class="timer-bg" cx="100" cy="100" r="90"/>
                        <circle class="timer-progress" id="progressCircle" cx="100" cy="100" r="90" stroke-dasharray="565.5" stroke-dashoffset="0"/>
                        <circle class="breathing-ring" id="breathRing" cx="100" cy="100" r="40"/>
                    </svg>
                    <div class="timer-display">
                        <div class="timer-time" id="timerTime">25:00</div>
                        <div class="timer-label" id="timerLabel">Focus</div>
                    </div>
                </div>
            </div>
            <div class="timer-controls">
                <button class="icon-btn" id="btnReset">↺</button>
                <button class="icon-btn" id="btnStart" style="width:70px;height:70px;font-size:2rem;">▶</button>
                <button class="icon-btn" id="btnAdd5">+5</button>
            </div>
            <div class="control-panel" id="breathingControls" style="display:none;"></div>
            <button class="btn btn-outline" id="btnBack">← Back</button>
        </div>`;
}

function renderSettings() {
    return `
        <div class="view active">
            <h2>Settings</h2>
            <label><input type="checkbox" id="soundCheckbox" checked> Sound</label>
            <label><input type="checkbox" id="notifCheckbox" checked> Notifications</label>
            <label><input type="number" id="dailyGoal" value="120"> Daily Goal (min)</label>
        </div>`;
}

// Navigation
function switchView(view) {
    currentView = view;
    main.innerHTML = renderView(view);
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
    if (view === 'home') setupModeCards();
    if (view === 'timer') setupTimerUI();
    if (view === 'analytics') renderAnalytics();
}

navButtons.forEach(b => b.addEventListener('click', () => switchView(b.dataset.view)));

// Mode cards
function setupModeCards() {
    const grid = document.getElementById('modeGrid');
    grid.innerHTML = MODES.map(m => `
        <div class="mode-card" data-mode="${m.id}">
            <div class="mode-icon">${m.icon}</div>
            <div class="mode-name">${m.name}</div>
        </div>`).join('');
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            startMode(card.dataset.mode);
            switchView('timer');
        });
    });
}

// Timer UI binding after render
function setupTimerUI() {
    document.getElementById('btnStart').addEventListener('click', () => {
        import('./timer.js').then(m => m.toggleTimer());
    });
    document.getElementById('btnReset').addEventListener('click', () => {
        import('./timer.js').then(m => m.resetTimer());
    });
    document.getElementById('btnAdd5').addEventListener('click', () => {
        import('./timer.js').then(m => m.addFive());
    });
    document.getElementById('btnBack').addEventListener('click', () => switchView('home'));
    // Breathing controls injected by breathing module
    if (getCurrentMode()?.id === 'breathing') initBreathingControls();
}

// Theme toggle
document.getElementById('themeBtn').addEventListener('click', () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
});

// Soundscape generator (placeholder)
document.getElementById('soundscapeBtn').addEventListener('click', () => {
    // Could toggle ambient sound
});

// Init
loadSettings();
switchView('home');
