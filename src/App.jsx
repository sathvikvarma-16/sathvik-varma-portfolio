import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { store } from './store.js';
import { buildTimeline } from './timeline.js';
import { initScroll, getScroll, destroyScroll } from './lib/scroll.js';
import World from './world/World.jsx';
import Overlay from './ui/Overlay.jsx';
import Cursor from './ui/Cursor.jsx';

const UNIT_VH = 58; // scroll length per timeline unit

export default function App() {
  const [fonts, setFonts] = useState(false);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(() => window.innerWidth < 760);

  const tl = useMemo(() => {
    store.mobile = mobile;
    store.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    store.tl = buildTimeline(mobile);
    return store.tl;
  }, [mobile]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.classList.add('locked');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event) => {
      store.reduced = event.matches;
    };
    motionPreference.addEventListener('change', onMotionChange);
    const l = initScroll();
    l.stop();
    store.onIntroDone = () => {
      document.documentElement.classList.remove('locked');
      getScroll()?.start();
      setReady(true);
    };
    const move = (e) => {
      if (e.pointerType === 'mouse') store.hasPointer = true;
      store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move);
    let active = true;
    let fontTimer;
    const timeout = new Promise((r) => {
      fontTimer = window.setTimeout(r, 2500);
    });
    Promise.race([
      Promise.all([
        document.fonts.load('900 220px "Inter Tight"'),
        document.fonts.load('300 40px "Inter Tight"'),
        document.fonts.load('400 40px "Instrument Serif"'),
        document.fonts.load('italic 400 40px "Instrument Serif"'),
        document.fonts.load('500 20px "JetBrains Mono"'),
      ]),
      timeout,
    ]).then(() => {
      window.clearTimeout(fontTimer);
      if (active) setFonts(true);
    });
    let lastMobile = window.innerWidth < 760;
    const onResize = () => {
      const nextMobile = window.innerWidth < 760;
      if (nextMobile !== lastMobile) {
        lastMobile = nextMobile;
        setMobile(nextMobile);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      active = false;
      window.clearTimeout(fontTimer);
      motionPreference.removeEventListener('change', onMotionChange);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', onResize);
      store.onIntroDone = null;
      destroyScroll();
    };
  }, []);

  return (
    <>
      <div className="stage">
        {fonts && (
          <Canvas
            key={mobile ? 'mobile' : 'desktop'}
            eventSource={document.getElementById('root')}
            eventPrefix="client"
            dpr={[1, Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)]}
            gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
            camera={{ fov: mobile ? 54 : 40, near: 0.1, far: 420, position: [0, 0, 8] }}
          >
            <World />
          </Canvas>
        )}
      </div>
      {fonts && <Overlay ready={ready} />}
      <Cursor />
      <div className="spacer" style={{ height: `${tl.total * UNIT_VH}vh` }} />
    </>
  );
}
