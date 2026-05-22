import React, { useMemo } from 'react';

const EMOJIS = ['🌹','💕','💖','💗','❤️','🌸','💝','🌷','💓','💞'];

export default function HeartsBg() {
  const hearts = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id:       i,
      left:     `${Math.random() * 100}%`,
      delay:    `${Math.random() * 10}s`,
      duration: `${7 + Math.random() * 6}s`,
      emoji:    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size:     `${10 + Math.random() * 12}px`,
    })), []);

  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%',
      pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {hearts.map(h => (
        <span key={h.id} style={{
          position: 'absolute',
          left: h.left,
          fontSize: h.size,
          opacity: 0,
          animation: `floatUp ${h.duration} ease-in ${h.delay} infinite`,
        }}>{h.emoji}</span>
      ))}
    </div>
  );
}
