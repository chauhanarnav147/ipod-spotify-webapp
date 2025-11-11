import React from 'react'
export default function CoverFlow({items=[]}){
  if(!items.length) return (<div className='carousel placeholder'>No covers</div>)
  return (<div className='carousel'>{items.slice(0,7).map((p,i)=>{const img=p.images&&p.images[0]?p.images[0].url:null;const offset=i-Math.floor(items.slice(0,7).length/2)
    const style={transform:`translateX(${offset*70}px) rotateY(${offset*-15}deg) scale(${1-Math.abs(offset)*0.12})`,zIndex:10-Math.abs(offset)}
    return(<div key={p.id} className='cover' style={style} title={p.name}>{img?<img src={img} alt='cover'/>:<div className='cover-text'>{p.name}</div>}</div>)})}</div>)}