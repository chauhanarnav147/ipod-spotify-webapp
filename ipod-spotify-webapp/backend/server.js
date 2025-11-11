import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())
app.post('/exchange', async (req,res)=>{
  const {code,redirect_uri,code_verifier}=req.body
  const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri,client_id:process.env.SPOTIFY_CLIENT_ID,client_secret:process.env.SPOTIFY_CLIENT_SECRET,code_verifier})
  try{const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});const data=await r.json();res.json(data)}catch(e){res.status(500).json({error:'token exchange failed'})}})
const port=process.env.PORT||3001
app.listen(port,()=>console.log('backend listening',port))