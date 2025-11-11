// --- IpodShell.jsx ---
import React, { useState } from 'react'
import IpodMenu from './IpodMenu'
import IpodWheel from './IpodWheel'
import './Ipod.css'
import { initAudio } from './IpodAudio'


export default function IpodShell({ playlists = [], onSelectPlaylist = () => {}, onLogout = () => {}, onRequestAuth = () => {} }){
const [screen, setScreen] = useState('menu') // menu | list | now
const [listItems, setListItems] = useState([])
const [title, setTitle] = useState('iPod Classic')


// prepare sounds
React.useEffect(()=>{ initAudio() }, [])


function openPlaylists(){
setTitle('Playlists')
setListItems(playlists)
setScreen('list')
}


function openNow(){ setTitle('Now Playing'); setScreen('now') }


function onMenuSelect(key){
if(key === 'Playlists') openPlaylists()
else if(key === 'Now Playing') openNow()
else if(key === 'Settings') alert('Settings not implemented yet')
}


function onItemSelect(item){
onSelectPlaylist(item)
setTitle(item.name || 'Playlist')
setScreen('now')
}


return (
<div className="ipod-shell">
<div className="ipod-screen">
{ screen === 'menu' && <IpodMenu onSelect={onMenuSelect} title={title} /> }
{ screen === 'list' && <div className="list-wrap"><div className="list-title">{title}</div>{listItems.length ? (
<div className="list-items">
{listItems.map((p,idx)=> (
<div key={p.id||idx} className="list-item" onClick={()=>onItemSelect(p)}>
<img src={(p.images && p.images[0] && p.images[0].url) || ''} alt="cover"/>
<div className="li-meta"><div className="li-title">{p.name}</div><div className="li-sub small">{p.tracks ? p.tracks.total + ' tracks' : ''}</div></div>
</div>
))}
</div>
) : <div className="empty">No items</div> }</div> }


{ screen === 'now' && <div className="now-wrap"><div className="now-cover-box"> {/* Placeholder - App can render now playing */}</div><div className="now-meta small">Select a playlist to view tracks</div></div> }


{ !playlists || playlists.length === 0 ? <div className="connect-cta"><button onClick={onRequestAuth} className="connect-btn">Connect Spotify</button></div> : null }
</div>


<IpodWheel onMenuPress={()=>setScreen('menu')} onSelectPress={()=>{ /* center press action */ }} onBackPress={()=>setScreen('menu')} onNavigate={(dir)=>{
// dir: 'up' | 'down' — bubble to menu or list components if needed
}} />


<div className="ipod-actions">
<button className="text-btn" onClick={onLogout}>Logout</button>
</div>
</div>
)
}
