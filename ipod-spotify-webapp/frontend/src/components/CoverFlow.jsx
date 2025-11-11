import React from 'react'

export default function CoverFlow({ items = [], activeIndex = 0, setActiveIndex = () => {} }){
  const visible = items.slice(0, 21) // cap for performance
  if(!items.length) return (
    <div className="carousel placeholder">No covers</div>
  )

  // center relative to activeIndex within visible slice
  const startIndex = Math.max(0, activeIndex - 6)
  const slice = items.slice(startIndex, startIndex + 13)

  return (
    <div className="carousel" role="list">
      {slice.map((p, idx) => {
        const realIndex = startIndex + idx
        const img = p.images && p.images[0] ? p.images[0].url : null
        const offset = idx - Math.floor(slice.length / 2)
        const abs = Math.abs(offset)
        const transform = `translateX(${offset * 72}px) rotateY(${offset * -14}deg) scale(${1 - Math.min(0.6, abs * 0.12)})`
        const z = 100 - abs
        const cls = (realIndex === activeIndex) ? 'cover active' : 'cover'
        return (
          <div
            key={p.id || realIndex}
            className={cls}
            style={{ transform, zIndex: z }}
            title={p.name}
            onClick={() => setActiveIndex(realIndex)}
          >
            { img
              ? <img src={img} alt={p.name} />
              : <div className="cover-text">{p.name}</div>
            }
          </div>
        )
      })}
    </div>
  )
}
