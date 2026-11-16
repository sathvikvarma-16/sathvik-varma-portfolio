import React, { useEffect, useRef } from 'react';
import { store } from '../store.js';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
    if (!fine) return;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, hover = false;
    let lastHover = null;
    let raf = null;
    const move = (e) => {
      if (motionPreference.matches) return;
      x = e.clientX;
      y = e.clientY;
      hover = !!e.target.closest?.('button, a');
      schedule();
    };
    const onMotionChange = (e) => {
      document.documentElement.classList.toggle('has-cursor', !e.matches);
      if (e.matches && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    motionPreference.addEventListener('change', onMotionChange);
    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = null;
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        const isHover = hover || store.hover3d;
        if (lastHover !== isHover) {
          lastHover = isHover;
          ring.current.classList.toggle('is-hover', isHover);
        }
      }
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) schedule();
    };
    schedule();
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      motionPreference.removeEventListener('change', onMotionChange);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
