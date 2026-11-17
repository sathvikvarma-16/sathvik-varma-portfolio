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
    let target = null;
    let lastHover = null;
    let raf = null;
    let lastTime = 0;
    const move = (e) => {
      if (motionPreference.matches) return;
      x = e.clientX;
      y = e.clientY;
      target = e.target;
      schedule();
    };
    const leave = () => {
      x = -100;
      y = -100;
      target = null;
      hover = false;
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
    window.addEventListener('pointerleave', leave, { passive: true });
    window.addEventListener('blur', leave);
    motionPreference.addEventListener('change', onMotionChange);
    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const tick = (now) => {
      raf = null;
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 1 / 60;
      lastTime = now;
      const alpha = 1 - Math.exp(-13.388 * dt);
      rx += (x - rx) * alpha;
      ry += (y - ry) * alpha;
      hover = !!target?.closest?.('button, a');
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        const moving = Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1;
        dot.current?.classList.toggle('is-moving', moving);
        ring.current.classList.toggle('is-moving', moving);
        const isHover = hover || store.hover3d;
        if (lastHover !== isHover) {
          lastHover = isHover;
          ring.current.classList.toggle('is-hover', isHover);
        }
        if (moving) schedule();
      }
    };
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
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
