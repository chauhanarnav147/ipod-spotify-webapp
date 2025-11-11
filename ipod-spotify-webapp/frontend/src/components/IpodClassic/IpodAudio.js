// --- IpodAudio.js ---
let sounds = null
export function initAudio(){
if(sounds) return
sounds = {
scroll: new Audio('/sounds/scroll.mp3'),
select: new Audio('/sounds/select.mp3'),
back: new Audio('/sounds/back.mp3')
}
// pre-load
Object.values(sounds).forEach(a=>{ a.volume = 0.9; a.load() })
}
export function playScroll(){ if(sounds && sounds.scroll){ sounds.scroll.currentTime = 0; sounds.scroll.play().catch(()=>{}) } }
export function playSelect(){ if(sounds && sounds.select){ sounds.select.currentTime = 0; sounds.select.play().catch(()=>{}) } }
export function playBack(){ if(sounds && sounds.back){ sounds.back.currentTime = 0; sounds.back.play().catch(()=>{}) } }

