// simple audio helper for iPod click / scroll / back sounds
// expects sound files at: frontend/public/sounds/scroll.mp3, select.mp3, back.mp3

let _sounds = null

export function initAudio() {
  if (_sounds) return
  const base = window.location.origin
  _sounds = {
    scroll: new Audio(base + '/sounds/scroll.mp3'),
    select: new Audio(base + '/sounds/select.mp3'),
    back: new Audio(base + '/sounds/back.mp3'),
  }
  // set a reasonable volume and preload
  Object.values(_sounds).forEach(a => {
    a.volume = 0.9
    a.preload = 'auto'
    // try load (some browsers ignore)
    try { a.load() } catch {}
  })
}

export function playScroll() {
  try {
    if (!_sounds) initAudio()
    const s = _sounds && _sounds.scroll
    if (s) { s.currentTime = 0; s.play().catch(()=>{}) }
  } catch (e) { /* ignore */ }
}

export function playSelect() {
  try {
    if (!_sounds) initAudio()
    const s = _sounds && _sounds.select
    if (s) { s.currentTime = 0; s.play().catch(()=>{}) }
  } catch (e) {}
}

export function playBack() {
  try {
    if (!_sounds) initAudio()
    const s = _sounds && _sounds.back
    if (s) { s.currentTime = 0; s.play().catch(()=>{}) }
  } catch (e) {}
}
