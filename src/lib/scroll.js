import Lenis from 'lenis';
import { store } from '../store.js';

let lenis = null;
let rafId = null;

const requestFrame = () => {
  if (lenis && rafId === null) rafId = requestAnimationFrame(raf);
};

const raf = (time) => {
  rafId = null;
  if (!lenis) return;
  lenis.raf(time);
  if (lenis.isScrolling) requestFrame();
};

export function initScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.4, smoothWheel: true });
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    store.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  lenis.on('scroll', update);
  lenis.on('virtual-scroll', requestFrame);
  return lenis;
}

export const getScroll = () => lenis;

export function destroyScroll() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  lenis?.destroy();
  lenis = null;
}

export function scrollToU(u) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = u * max;
  if (lenis) {
    lenis.scrollTo(y, { duration: 2.6, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    requestFrame();
  } else window.scrollTo({ top: y, behavior: 'smooth' });
}
