import React, { useRef, useEffect } from 'react'
import { playScroll, playSelect } from './IpodAudio'


export default function IpodWheel({ onMenuPress=()=>{}, onSelectPress=()=>{}, onBackPress=()=>{}, onNavigate=(d)=>{} }){
const outerRef = useRef(null)
const lastAngle = useRef(null)


useEffect(()=>{
const el = outerRef.current
if(!el) return
function down(e){ el.setPointerCapture(e.pointerId); const r = el.getBoundingClientRect(); lastAngle.current = Math.atan2(e.clientY - (r.top + r.height/2), e.clientX - (r.left + r.width/2)) }
function move(e){ if(lastAngle.current == null) return; const r = el.getBoundingClientRect(); const a = Math.atan2(e.clientY - (r.top + r.height/2), e.clientX - (r.left + r.width/2)); let d = a - lastAngle.current; if(Math.abs(d) > 0.025){ // threshold
if(d > 0){ onNavigate('up') } else { onNavigate('down') }
playScroll()
lastAngle.current = a
}}
function up(e){ lastAngle.current = null }
el.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
return ()=>{ el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
},[outerRef.current])


return (
<div className="wheel-root">
<div className="wheel-outer" ref={outerRef}>
<div className="wheel-center" onClick={()=>{ playSelect(); onSelectPress() }}>
<div className="wheel-center-label">Select</div>
</div>
</div>
<div className="wheel-controls">
<button className="wheel-mini" onClick={()=>{ playSelect(); onBackPress() }}>Menu</button>
</div>
</div>
)
}
