const v = document.getElementById('v');
const stage = document.getElementById('stage');
const start = document.getElementById('start');
const startBtn = document.getElementById('startBtn');
const choice = document.getElementById('choice');
const goA = document.getElementById('goA');
const goB = document.getElementById('goB');

let lastSafe = 0,
    guardSeek = false,
    ended = false;

function show(el) {
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
}

function hide(el) {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
}

function blockKeys(e) {
    const k = e.key;
    if ([' ', 'Spacebar', 'ArrowLeft', 'ArrowRight', 'k', 'j', 'l', 'f', 'F11'].includes(k) || k.startsWith('Media')) {
        e.preventDefault();
    }
}

function choiceKeys(e) {
    const k = e.key.toLowerCase();
    if (k === 'a') goA.click();
    if (k === 'b') goB.click();
}

function lockInteractions() {
    document.addEventListener('contextmenu', preventDefault, { capture: true });
    document.addEventListener('keydown', blockKeys, { capture: true });
    v.addEventListener('dragstart', preventDefault);
    v.addEventListener('touchstart', preventDefault, { passive: false });
    v.addEventListener('pointerdown', preventDefault);
}

function unlockInteractions() {
    document.removeEventListener('contextmenu', preventDefault, { capture: true });
    document.removeEventListener('keydown', blockKeys, { capture: true });
}

function preventDefault(e) { e.preventDefault(); }

startBtn.addEventListener('click', async() => {
    hide(start);
    lockInteractions();
    if (stage.requestFullscreen) { try { await stage.requestFullscreen(); } catch {} }
    v.currentTime = 0;
    lastSafe = 0;
    ended = false;

    try { await v.play(); } catch {
        v.muted = true;
        try { await v.play(); } finally { v.muted = false; }
    }
});

v.addEventListener('pause', () => { if (!ended) v.play().catch(() => {}); });
v.addEventListener('ratechange', () => { if (v.playbackRate !== 1) v.playbackRate = 1; });
v.addEventListener('volumechange', () => { if (v.muted && !ended) v.muted = false; });

v.addEventListener('timeupdate', () => {
    if (!guardSeek) lastSafe = Math.max(lastSafe, v.currentTime);
});

v.addEventListener('seeking', () => {
    if (v.currentTime > lastSafe + 0.25) {
        guardSeek = true;
        v.currentTime = lastSafe;
        guardSeek = false;
    }
});

v.addEventListener('ended', () => {
    ended = true;
    unlockInteractions();
    document.removeEventListener('keydown', blockKeys, { capture: true });
    document.addEventListener('keydown', choiceKeys);
    show(choice);
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch {} }
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !ended) v.play().catch(() => {});
});