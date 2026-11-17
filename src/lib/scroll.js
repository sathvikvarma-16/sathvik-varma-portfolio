import { store, easeOut } from '../store.js';

let maxScroll = 0;
let resizeObserver = null;
let initialized = false;
let measureFrame = null;
let scrollFrame = null;
let scrollFrom = 0;
let scrollTo = 0;
let scrollElapsed = 0;
let scrollLast = 0;
const scrollDuration = 1200;

const cancelSmoothScroll = () => {
  if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
  scrollFrame = null;
};

const cancelOnInput = () => cancelSmoothScroll();

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
  window.addEventListener('wheel', cancelOnInput, { passive: true });
  window.addEventListener('touchstart', cancelOnInput, { passive: true });
  window.addEventListener('pointerdown', cancelOnInput, { passive: true });
  window.addEventListener('keydown', cancelOnInput);
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
  window.removeEventListener('wheel', cancelOnInput);
  window.removeEventListener('touchstart', cancelOnInput);
  window.removeEventListener('pointerdown', cancelOnInput);
  window.removeEventListener('keydown', cancelOnInput);
  if (measureFrame !== null) cancelAnimationFrame(measureFrame);
  measureFrame = null;
  cancelSmoothScroll();
  resizeObserver?.disconnect();
  resizeObserver = null;
  initialized = false;
}

export function scrollToU(u) {
  const top = Math.min(1, Math.max(0, u)) * maxScroll;
  cancelSmoothScroll();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top, behavior: 'auto' });
    return;
  }
  scrollFrom = window.scrollY;
  scrollTo = top;
  scrollElapsed = 0;
  scrollLast = 0;
  if (scrollFrom === scrollTo) return;
  const step = (now) => {
    const dt = scrollLast ? Math.min((now - scrollLast) / 1000, 1 / 30) : 1 / 60;
    scrollLast = now;
    scrollElapsed = Math.min(scrollDuration, scrollElapsed + dt * 1000);
    const progress = scrollElapsed / scrollDuration;
    window.scrollTo(0, scrollFrom + (scrollTo - scrollFrom) * easeOut(progress));
    if (progress < 1) scrollFrame = requestAnimationFrame(step);
    else scrollFrame = null;
  };
  scrollFrame = requestAnimationFrame(step);
}
