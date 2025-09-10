const v = document.getElementById('v')
const start = document.getElementById('start')
const startBtn = document.getElementById('startBtn')
const choice = document.getElementById('choice')
const goA = document.getElementById('goA')
const goB = document.getElementById('goB')

v.controls = false
v.tabIndex = -1
if ('disablePictureInPicture' in v) v.disablePictureInPicture = true
v.setAttribute('disableRemotePlayback', '')
v.addEventListener('contextmenu', e => e.preventDefault())
v.addEventListener('dragstart', e => e.preventDefault())

let lastT = 0
v.addEventListener('timeupdate', () => {
    if (!isNaN(v.currentTime)) lastT = Math.max(lastT, v.currentTime)
})
v.addEventListener('seeking', () => {
    if (Math.abs(v.currentTime - lastT) > 0.5) v.currentTime = lastT
})
v.addEventListener('ratechange', () => {
    if (v.playbackRate !== 1) v.playbackRate = 1
})
v.addEventListener('pause', () => {
    if (!v.ended) v.play().catch(() => {})
})

function showChoice() {
    choice.classList.add('show')
}

function hide(el) {
    el.classList.remove('show')
}

startBtn.addEventListener('click', async() => {
    hide(start)
    try {
        v.muted = false
        await v.play()
    } catch {
        v.muted = true
        await v.play()
    }
    v.blur()
})

v.addEventListener('ended', showChoice)

const BLOCK_KEYS = new Set([' ', 'k', 'K', 'MediaPlayPause', 'MediaTrackNext', 'MediaTrackPrevious', 'j', 'l', 'J', 'L', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'])
document.addEventListener('keydown', e => {
    if (!choice.classList.contains('show')) {
        if (BLOCK_KEYS.has(e.key) || e.code === 'Space') {
            e.preventDefault()
        }
    } else {
        const k = e.key.toLowerCase()
        if (k === 'a') goA.click()
        if (k === 'b') goB.click()
    }
})

document.addEventListener('visibilitychange', () => {
    if (document.hidden && v.paused && !v.ended) v.play().catch(() => {})
})