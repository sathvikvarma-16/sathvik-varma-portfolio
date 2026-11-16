import { store } from '../store.js';

let maxScroll = 0;
let resizeObserver = null;
let initialized = false;
let measureFrame = null;

const updateProgress = () => {
  store.target = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
};

const measureScrollRange = () => {
  maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  updateProgress();
};

const scheduleMeasure = () => {
  if (measureFrame !== null) return;
  measureFrame = requestAnimationFrame(() => {
    measureFrame = null;
    measureScrollRange();
  });
};

export function initScroll() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', scheduleMeasure, { passive: true });
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(measureScrollRange);
    resizeObserver.observe(document.documentElement);
  }
  measureScrollRange();
}

export function destroyScroll() {
  if (!initialized) return;
  window.removeEventListener('scroll', updateProgress);
  window.removeEventListener('resize', scheduleMeasure);
  if (measureFrame !== null) cancelAnimationFrame(measureFrame);
  measureFrame = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
  initialized = false;
}

export function scrollToU(u) {
  window.scrollTo({
    top: Math.min(1, Math.max(0, u)) * maxScroll,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}
