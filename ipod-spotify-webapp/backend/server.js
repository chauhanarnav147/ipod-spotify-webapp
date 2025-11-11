import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

// --- CORS middleware (simple, safe for this app) ---
app.use((req, res, next) => {
  // In production you should set this to your frontend origin, not '*'
  const allowed = process.env.ALLOWED_ORIGIN || '*'
  res.setHeader('Access-Control-Allow-Origin', allowed)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  // allow cookies/credentials if needed:
  // res.setHeader('Access-Control-Allow-Credentials', 'true')

  // respond to preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
// --- end CORS middleware ---

app.post('/exchange', async (req, res) => {
  const { code, redirect_uri, code_verifier } = req.body

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    code_verifier
  })

  try {
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })
    const data = await r.json()
    // forward Spotify response
    return res.json(data)
  } catch (e) {
    console.error('Token exchange error', e)
    return res.status(500).json({ error: 'token exchange failed', details: String(e) })
  }
})

app.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  })
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  const data = await r.json()
  res.json(data)
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log('backend listening', port))
