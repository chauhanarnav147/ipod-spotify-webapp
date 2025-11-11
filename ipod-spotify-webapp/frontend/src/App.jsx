import React, {useEffect, useState} from 'react'
import CoverFlow from './components/CoverFlow'
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'
const REDIRECT_URI = window.location.origin + '/callback'
const SCOPES = ['user-read-private','user-read-email','user-library-read','user-read-playback-state','user-modify-playback-state','streaming']
function App(){
  const [token, setToken] = useState(localStorage.getItem('sp_token') || null)
  const [playlists, setPlaylists] = useState([])
  const [status, setStatus] = useState('not connected')
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if(code && !token){
      const verifier = localStorage.getItem('pkce_verifier')
      fetch((import.meta.env.VITE_BACKEND_URL||'') + '/exchange',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,redirect_uri:REDIRECT_URI,code_verifier:verifier})})
      .then(r=>r.json()).then(data=>{if(data.access_token){setToken(data.access_token);localStorage.setItem('sp_token',data.access_token);window.history.replaceState({},'', '/')}}).catch(e=>setStatus('exchange error'))
    }
  },[])
  useEffect(()=>{if(token){fetch('https://api.spotify.com/v1/me/playlists?limit=20',{headers:{Authorization:'Bearer '+token}}).then(r=>r.json()).then(d=>setPlaylists(d.items||[])).catch(e=>setStatus('fetch failed'))}},[token])
  async function startAuth(){
    const verifier=[...crypto.getRandomValues(new Uint8Array(64))].map(b=>('0'+b.toString(16)).slice(-2)).join('')
    localStorage.setItem('pkce_verifier',verifier)
    const enc=new TextEncoder();const hash=await crypto.subtle.digest('SHA-256',enc.encode(verifier))
    const challenge=btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
    const url=new URL('https://accounts.spotify.com/authorize')
    url.searchParams.set('client_id',CLIENT_ID);url.searchParams.set('response_type','code');url.searchParams.set('redirect_uri',REDIRECT_URI)
    url.searchParams.set('scope',SCOPES.join(' '));url.searchParams.set('code_challenge_method','S256');url.searchParams.set('code_challenge',challenge)
    window.location=url.toString()
  }
  return(<div className='app-root'><div className='ipod'><div className='screen'><div className='coverflow-area'><div className='screen-text'>{status}</div></div></div><CoverFlow items={playlists}/><div className='wheel'><button className='btn' onClick={startAuth}>Connect Spotify</button></div></div></div>)}
export default App