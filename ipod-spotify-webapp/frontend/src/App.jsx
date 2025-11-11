import React, { useEffect, useState } from 'react'
import CoverFlow from './components/CoverFlow'
import './styles.css'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = window.location.origin + '/callback'
const SCOPES = [
  'user-read-private', 'user-read-email', 'user-library-read',
  'user-read-playback-state', 'user-modify-playback-state', 'streaming'
]

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('sp_token') || null)
  const [playlists, setPlaylists] = useState([])
  const [status, setStatus] = useState('not connected')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if(code && !token){
      const verifier = localStorage.getItem('pkce_verifier')
      fetch((import.meta.env.VITE_BACKEND_URL||'') + '/exchange', {
        method: 'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ code, redirect_uri: REDIRECT_URI, code_verifier: verifier })
      }).then(r=>r.json()).then(data=>{
        if(data.access_token){
          setToken(data.access_token); localStorage.setItem('sp_token', data.access_token)
          window.history.replaceState({}, '', '/')
        } else {
          setStatus('exchange failed')
          console.error('exchange failed', data)
        }
      }).catch(e=>{setStatus('exchange error'); console.error(e)})
    }
  }, [])

  useEffect(()=>{
    if(token){
      setStatus('fetching playlists...')
      fetch('https://api.spotify.com/v1/me/playlists?limit=50', { headers:{ Authorization: 'Bearer ' + token }})
        .then(r=>r.json()).then(d=>{
          const items = d.items || []
          setPlaylists(items)
          setActiveIndex( Math.max(0, Math.floor(items.length/2)) )
          setStatus('connected')
        }).catch(e=>{
          setStatus('fetch failed'); console.error(e)
        })
    }
  }, [token])

  async function startAuth(){
    const verifier = [...crypto.getRandomValues(new Uint8Array(64))].map(b=>('0'+b.toString(16)).slice(-2)).join('')
    localStorage.setItem('pkce_verifier', verifier)
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(verifier))
    const challenge = btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
    const url = new URL('https://accounts.spotify.com/authorize')
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('redirect_uri', REDIRECT_URI)
    url.searchParams.set('scope', SCOPES.join(' '))
    url.searchParams.set('code_challenge_method', 'S256')
    url.searchParams.set('code_challenge', challenge)
    window.location = url.toString()
  }

  function logout(){
    localStorage.removeItem('sp_token')
    setToken(null)
    setPlaylists([])
    setStatus('not connected')
  }

  // big cover shown above carousel
  const activeItem = playlists[activeIndex] || null
  const activeImage = activeItem && activeItem.images && activeItem.images[0] ? activeItem.images[0].url : null
  const activeTitle = activeItem ? activeItem.name : ''

  return (
    <div className="app-root">
      <div className="ipod">
        <div className="screen">
          { activeImage
            ? <img src={activeImage} alt="active cover" className="big-cover" />
            : <div className="big-cover placeholder" />
          }
        </div>

        <CoverFlow
          items={playlists}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        <div className="meta">
          <div className="track-title">{ activeTitle || (status === 'connected' ? 'Select a playlist' : 'Not connected') }</div>
        </div>

        <div className="wheel">
          { token
            ? <button className="btn" onClick={logout}>Logout</button>
            : <button className="btn" onClick={startAuth}>Connect Spotify</button>
          }
        </div>
      </div>
    </div>
  )
}
