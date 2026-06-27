import { getHistory } from './storage.js';

export function renderAnalytics() {
    const history = getHistory();
    const container = document.querySelector('#mainContent');
    container.innerHTML = `
        <div class="view active">
            <h2>Analytics</h2>
            <div class="stats-row">
                <div>Today: <span id="todayFocus">0m</span></div>
                <div>Sessions: <span id="sessionCount">0</span></div>
                <div>Streak: <span id="streak">0🔥</span></div>
            </div>
            <div id="heatmap"></div>
            <div id="modeChart"></div>
            <button class="btn" id="exportBtn">Export JSON</button>
        </div>`;
    // Calculation and rendering of heatmap/chart
    renderHeatmap(history);
}

function renderHeatmap(data) {
    const container = document.getElementById('heatmap');
    // simple last 30 days
    let html = '';
    for (let i=29; i>=0; i--) {
        const d = new Date(Date.now() - i*86400000).toDateString();
        const min = data.filter(s=>new Date(s.date).toDateString()===d).reduce((a,s)=>a+s.duration,0);
        const intensity = Math.min(1, min/60);
        html += `<div class="heat-cell" style="background:rgba(124,92,231,${intensity})" title="${d}: ${min}m"></div>`;
    }
    container.innerHTML = html;
}
