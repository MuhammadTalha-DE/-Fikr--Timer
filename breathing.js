import { MODES } from './config.js';

let breathingParams = { inhale:4, hold:4, exhale:4, hold2:4, cycles:5 };
let phases = [];
let phaseIdx = 0;
let cycle = 0;
let running = false;

export function initBreathing(custom = {}) {
    breathingParams = {
        inhale: custom.inhale || 4,
        hold: custom.hold ?? 4,
        exhale: custom.exhale || 4,
        hold2: custom.hold2 ?? 4,
        cycles: custom.cycles || 5
    };
    buildPhases();
    phaseIdx = 0; cycle = 0;
    document.getElementById('breathingPhase').style.display = 'block';
    document.getElementById('timerLabel').style.display = 'none';
    updateBreathingUI();
    // start timer in timer.js
    import('./timer.js').then(m => m.setTime(phases[0].duration));
}

function buildPhases() {
    phases = [{ name:'Inhale', duration: breathingParams.inhale }];
    if (breathingParams.hold > 0) phases.push({ name:'Hold', duration: breathingParams.hold });
    phases.push({ name:'Exhale', duration: breathingParams.exhale });
    if (breathingParams.hold2 > 0) phases.push({ name:'Hold', duration: breathingParams.hold2 });
}

export function updateBreathingUI() {
    const phase = phases[phaseIdx];
    document.getElementById('breathingPhase').textContent = phase.name.toUpperCase();
    const ring = document.getElementById('breathRing');
    if (phase.name === 'Inhale') ring.setAttribute('r', '80');
    else if (phase.name === 'Exhale') ring.setAttribute('r', '35');
    else ring.setAttribute('r', '50');
    ring.style.transition = `r ${phase.duration}s ease`;
    document.getElementById('roundInfo').textContent = `Cycle ${cycle+1}/${breathingParams.cycles}`;
}

export function nextPhase() {
    phaseIdx++;
    if (phaseIdx >= phases.length) {
        phaseIdx = 0;
        cycle++;
        if (cycle >= breathingParams.cycles) {
            // session end handled by timer
            return;
        }
        buildPhases(); // reflect any dynamic changes
    }
    const next = phases[phaseIdx];
    import('./timer.js').then(m => m.setTime(next.duration));
    updateBreathingUI();
}

export function initBreathingControls() {
    const panel = document.getElementById('breathingControls');
    panel.innerHTML = `
        <div class="nudge-row"><span>Inhale</span><button class="nudge" data-phase="inhale" data-dir="-">−</button><span id="inhaleVal">${breathingParams.inhale}</span><button class="nudge" data-phase="inhale" data-dir="+">+</button></div>
        <div class="nudge-row"><span>Hold</span><button class="nudge" data-phase="hold" data-dir="-">−</button><span id="holdVal">${breathingParams.hold}</span><button class="nudge" data-phase="hold" data-dir="+">+</button></div>
        <div class="nudge-row"><span>Exhale</span><button class="nudge" data-phase="exhale" data-dir="-">−</button><span id="exhaleVal">${breathingParams.exhale}</span><button class="nudge" data-phase="exhale" data-dir="+">+</button></div>
        <div class="nudge-row"><span>Hold</span><button class="nudge" data-phase="hold2" data-dir="-">−</button><span id="hold2Val">${breathingParams.hold2}</span><button class="nudge" data-phase="hold2" data-dir="+">+</button></div>
        <div class="nudge-row"><span>Cycles</span><button class="nudge" data-phase="cycles" data-dir="-">−</button><span id="cyclesVal">${breathingParams.cycles}</span><button class="nudge" data-phase="cycles" data-dir="+">+</button></div>
        <button class="preset" data-preset="box">Box</button>
        <button class="preset" data-preset="478">4-7-8</button>
    `;
    panel.style.display = 'grid';
    // event listeners omitted for brevity (same as earlier)
}
