import { saveSession } from './storage.js';
import { updateBreathingUI, getBreathingState } from './breathing.js';

let currentMode = null;
let timer = null;
let timeLeft = 0;
let totalDuration = 0;
let running = false;
let isBreak = false;
let round = 1;
let totalRounds = 1;

export function getCurrentMode() { return currentMode; }

export function startMode(modeId, customParams = {}) {
    const mode = MODES.find(m => m.id === modeId);
    currentMode = mode;
    stopTimer();
    if (modeId === 'breathing') {
        import('./breathing.js').then(m => m.initBreathing(customParams));
    } else {
        let focus = mode.defaults.focus || 25;
        timeLeft = focus * 60;
        totalDuration = timeLeft;
        totalRounds = mode.defaults.rounds || 1;
        round = 1;
        isBreak = false;
        document.getElementById('timerLabel').textContent = 'Focus';
        document.getElementById('breathingPhase').style.display = 'none';
    }
    document.getElementById('timerModeLabel').textContent = mode.icon + ' ' + mode.name;
    updateDisplay();
    updateProgress(1);
}

export function toggleTimer() {
    if (!currentMode) return;
    if (running) { stopTimer(); return; }
    running = true;
    document.getElementById('btnStart').textContent = '⏸';
    timer = setInterval(tick, 1000);
}

function stopTimer() {
    clearInterval(timer);
    running = false;
    document.getElementById('btnStart').textContent = '▶';
}

function tick() {
    if (timeLeft <= 0) {
        handleEnd();
        return;
    }
    timeLeft--;
    updateDisplay();
    updateProgress(timeLeft / totalDuration);
    document.title = `${formatTime(timeLeft)} - Fikr`;
}

function updateDisplay() {
    document.getElementById('timerTime').textContent = formatTime(timeLeft);
}

function updateProgress(ratio) {
    const circle = document.getElementById('progressCircle');
    if (circle) circle.style.strokeDashoffset = 565.5 * (1 - ratio);
}

function handleEnd() {
    stopTimer();
    if (currentMode.id === 'breathing') {
        import('./breathing.js').then(m => m.nextPhase());
    } else {
        if (!isBreak && round < totalRounds) {
            isBreak = true;
            round++;
            timeLeft = (currentMode.defaults.break || 5) * 60;
            totalDuration = timeLeft;
            document.getElementById('timerLabel').textContent = 'Break';
        } else {
            endSession();
            return;
        }
    }
    playSound();
}

function endSession() {
    saveSession({
        mode: currentMode.name,
        duration: Math.round((totalDuration - timeLeft) / 60),
        date: new Date().toISOString()
    });
    stopTimer();
    alert('Session completed!');
}

export function resetTimer() {
    if (currentMode) startMode(currentMode.id);
}

export function addFive() {
    if (currentMode?.id !== 'breathing' && currentMode?.id !== 'stopwatch') {
        timeLeft += 300;
        totalDuration += 300;
        updateDisplay();
    }
}

export function formatTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function playSound() {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    o.frequency.value = 880;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
}

// This module's MODES import
import { MODES } from './app.js'; // We'll need to export MODES from app.js
