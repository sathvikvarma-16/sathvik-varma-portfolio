import React, { useEffect, useRef } from 'react';
import { CONTACT } from '../content.js';

const Icons = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.76 2.03 3.04 1.34.1-.73.39-1.23.7-1.51-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.43-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.1-1.65-4.54-3.85-4.54-1.78 0-2.57.98-3.02 1.67V8.5h-3.37c.04.95 0 11.5 0 11.5h3.37v-6.42c0-.34.03-.69.13-.93.27-.69.89-1.4 1.94-1.4 1.37 0 1.92 1.05 1.92 2.59V20h3.38v-6.6Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />
    </svg>
  ),
};

function Magnetic({ className, label, href, children, download = false }) {
  const ref = useRef(null);
  const bounds = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  useEffect(() => {
    const onBlur = () => reset();
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('blur', onBlur);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);
  const schedule = () => {
    if (raf.current === null) raf.current = requestAnimationFrame(tick);
  };
  const tick = (now) => {
    raf.current = null;
    const r = bounds.current;
    const targetX = r ? (pointer.current.x - r.left - r.width / 2) * 0.35 : 0;
    const targetY = r ? (pointer.current.y - r.top - r.height / 2) * 0.35 : 0;
    const dt = Math.min((now - (tick.lastTime || now - 1000 / 60)) / 1000, 1 / 30);
    tick.lastTime = now;
    const alpha = 1 - Math.exp(-12 * dt);
    position.current.x += (targetX - position.current.x) * alpha;
    position.current.y += (targetY - position.current.y) * alpha;
    if (ref.current) {
      ref.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
    }
    if (Math.abs(targetX - position.current.x) > 0.1 || Math.abs(targetY - position.current.y) > 0.1) {
      schedule();
    } else {
      position.current.x = targetX;
      position.current.y = targetY;
      if (ref.current) ref.current.style.transform = targetX || targetY ? `translate3d(${targetX}px, ${targetY}px, 0)` : '';
    }
  };
  const onEnter = (e) => {
    if (e.pointerType !== 'mouse') return;
    bounds.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !bounds.current) return;
    pointer.current.x = e.clientX;
    pointer.current.y = e.clientY;
    schedule();
  };
  const reset = () => {
    bounds.current = null;
    schedule();
  };
  const external = href.startsWith('http');
  return (
    <a
      ref={ref}
      className={className}
      aria-label={label}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      download={download || undefined}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const socials = [
    { key: 'github', label: 'GitHub', href: CONTACT.github, icon: Icons.github },
    { key: 'email', label: 'Email', href: CONTACT.email ? `mailto:${CONTACT.email}` : '', icon: Icons.mail },
    { key: 'linkedin', label: 'LinkedIn', href: CONTACT.linkedin, icon: Icons.linkedin },
  ].filter((item) => item.href);

  return (
    <div className="ct">
      <span className="mono dim">(07) Contact</span>
      <h2 className="ct-title">
        <span className="ln">
          <span>Let’s build</span>
        </span>
        <span className="ln">
          <span>
            something <em>meaningful.</em>
          </span>
        </span>
      </h2>
      <div className="ct-row">
        <div className="socials">
          {socials.map((item) => (
            <Magnetic key={item.key} className="soc" label={item.label} href={item.href}>
              {item.icon}
            </Magnetic>
          ))}
        </div>
        {CONTACT.resume && (
          <Magnetic className="resume" label="Resume" href={CONTACT.resume} download>
            <span className="resume-ic">{Icons.arrow}</span>
            <span className="resume-txt">Resume</span>
            <span className="resume-fill" />
          </Magnetic>
        )}
      </div>
      <p className="contact-note">
        Thank you for visiting my portfolio! I'm always open to connecting, learning, and collaborating with like-minded people. Feel free to connect with me on LinkedIn or GitHub. I'd be happy to connect and exchange ideas.
      </p>
      <footer className="foot">
        <span className="mono dim">© 2026 Sathvik Varma</span>
        <span className="mono dim">CSE · Aspiring ML Engineer</span>
      </footer>
    </div>
  );
}
