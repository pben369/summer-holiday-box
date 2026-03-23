import React, { useEffect, useRef } from 'react';

const FIREFLIES = [
  { color: '#ccff00', size: 6, speed: 0.10 },
  { color: '#00e1ff', size: 5, speed: 0.07 },
  { color: '#ff2b85', size: 4, speed: 0.13 },
  { color: '#FFD700', size: 5, speed: 0.08 },
];

const FireflyDot = ({ color, size, speed }) => {
  const divRef = useRef(null);
  const posRef = useRef({ x: -200, y: -200 });
  const targetRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * speed;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * speed;
      if (divRef.current) {
        divRef.current.style.left = posRef.current.x + 'px';
        divRef.current.style.top = posRef.current.y + 'px';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      ref={divRef}
      style={{
        position: 'fixed',
        left: '-200px',
        top: '-200px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        animation: 'fireflyPulse 1.5s infinite alternate ease-in-out',
      }}
    />
  );
};

const Firefly = () => {
  // Skip on touch-only devices (mobile)
  if (window.matchMedia('(hover: none)').matches) return null;
  return <>{FIREFLIES.map((f, i) => <FireflyDot key={i} {...f} />)}</>;
};

export default Firefly;
