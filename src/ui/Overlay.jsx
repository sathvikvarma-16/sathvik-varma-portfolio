import React, { useEffect, useRef, useState } from 'react';
import { store } from '../store.js';
import { vis, phase, centerU } from '../timeline.js';
import { scrollToU } from '../lib/scroll.js';
import { GROUPS, SKILLS, PROJECTS, STATS, JOURNEY, CERTS } from '../content.js';
import Contact from './Contact.jsx';

function Words({ text, base = 0 }) {
  return text.split(' ').map((w, i) => {
    const em = w.startsWith('*');
    const t = w.replace(/\*/g, '');
    return (
      <React.Fragment key={i}>
        <span className="wd">
          <span className={`wd-in ${em ? 'em' : ''}`} style={{ transitionDelay: `${base + i * 0.035}s` }}>
            {t}
          </span>
        </span>{' '}
      </React.Fragment>
    );
  });
}

export default function Overlay({ ready }) {
  const tl = store.tl;
  const I = tl.index;
  const panels = useRef([]);
  const [group, setGroup] = useState(null);
  const onRef = useRef({});

  useEffect(() => {
    let raf = null;
    const requestUpdate = () => {
      if (raf === null) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      raf = null;
      const u = store.off;
      panels.current.forEach((el) => {
        if (!el) return;
        const i = Number(el.dataset.shot);
        const fade = Number(el.dataset.fade || 0.3);
        let v = vis(tl, u, i, fade);
        if (i === 0 && !store.introDone) v = 0;
        const ph = phase(tl, u, i, fade);
        el.style.opacity = v.toFixed(3);
        el.style.visibility = v < 0.003 ? 'hidden' : 'visible';
        el.style.transform = `translate3d(0, ${(-ph * 60).toFixed(1)}px, 0)`;
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
        const key = el.dataset.key;
        const on = v > 0.55;
        if (onRef.current[key] !== on) {
          onRef.current[key] = on;
          el.classList.toggle('on', on);
        }
      });
      if (!store.introDone || Math.abs(store.target - store.off) > 0.0001) requestUpdate();
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    requestUpdate();
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [tl]);

  const reg = (el) => el && !panels.current.includes(el) && panels.current.push(el);
  const P = (key, shot, className, children, fade) => (
    <section key={key} ref={reg} data-shot={shot} data-key={key} data-fade={fade} className={`pnl ${className}`}>
      {children}
    </section>
  );

  const pickGroup = (g) => {
    store.skillGroup = g;
    setGroup(g);
  };

  return (
    <div className={`overlay ${ready ? 'ready' : ''}`}>
      {/* HERO */}
      {P(
        'hero',
        I.hero,
        'pnl-hero',
        <>
          <div className="hm-col">
            <span className="mono dim">SATHVIK VARMA</span>
            <span>Aspiring Machine Learning Engineer</span>
          </div>
          <div className="hm-col right">
            <span className="mono dim">MACHINE LEARNING · AI · DATA SCIENCE</span>
            <span>Visakhapatnam, India</span>
          </div>
        </>,
        0.25
      )}

      {/* ABOUT */}
      {P(
        'about',
        I.about,
        'pnl-about',
        <>
          <span className="mono dim kicker">(01) — Enter</span>
          <div className="lead">
            <p><Words text="Computer Science and Engineering student at ANITS, aspiring to build a career in Machine Learning Engineering." /></p>
            <p><Words text="Developing strong foundations in Python, DSA, SQL, Data Science, and Machine Learning." /></p>
            <p><Words text="Passionate about problem-solving, continuous learning, and building practical AI-driven solutions through hands-on projects." /></p>
          </div>
        </>
      )}

      {/* WORK */}
      {PROJECTS.map((p, i) =>
        P(
          `work${i}`,
          I[`work${i}`],
          `pnl-work ${tl.shots[I[`work${i}`]].pos.x > 0 ? 'side-right' : 'side-left'}`,
          <div className="work-card">
            <div className="wc-top mono dim">
              <span>(02) Selected Work</span>
              <span>
                0{i + 1} / 0{PROJECTS.length}
              </span>
            </div>
            <span className="mono dim wc-tag">{p.tag}</span>
            <h3 className="wc-title">
              <Words text={`${p.title} *${p.em}*`} />
            </h3>
            <p className="wc-desc">{p.desc}</p>
            <ul className="chips">
              {p.stack.map((s, k) => (
                <li key={s} style={{ transitionDelay: `${0.25 + k * 0.05}s` }}>
                  {s}
                </li>
              ))}
            </ul>
            {(p.github || p.link) && (
              <a className="project-link" href={p.github || p.link} target="_blank" rel="noreferrer">
                View project on GitHub ↗
              </a>
            )}
          </div>
        )
      )}

      {/* SKILLS */}
      {P(
        'skills',
        I.skills,
        'pnl-skills',
        <>
          <div className="sk-head">
            <span className="mono dim">(03)</span>
            <h2 className="big">
              <Words text="The *Toolkit*" />
            </h2>
          </div>
          <ul className="groups" onMouseLeave={() => pickGroup(null)}>
            {Object.entries(GROUPS).map(([g, ws], i) => (
              <li key={g} style={{ transitionDelay: `${0.15 + i * 0.06}s` }}>
                <button
                  className={`group ${group === g ? 'on' : ''}`}
                  onMouseEnter={() => pickGroup(g)}
                  onClick={() => pickGroup(group === g ? null : g)}
                >
                  <span className="mono dim gi">0{i + 1}</span>
                  <span className="gname">{g}</span>
                  <span className="mono dim">{ws.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </>,
        0.4
      )}
      <div className="labels">
        {SKILLS.map((s, i) => (
          <span key={s.w} className="sk-label" ref={(el) => (store.labels.skills[i] = el)}>
            {s.w}
          </span>
        ))}
        {STATS.map((s, i) => (
          <span key={s.label} className="tw-label" ref={(el) => (store.labels.towers[i] = el)}>
            <span className="tw-val">
              <span className="tw-num">0</span>
              <span className="tw-suf">{s.suffix}</span>
            </span>
            <span className="mono dim">{s.label}</span>
            {s.detail && <span className="tw-detail">{s.detail}</span>}
          </span>
        ))}
      </div>

      {/* NUMBERS */}
      {P(
        'numbers',
        I.numbers,
        'pnl-numbers',
        <>
          <div className="nb-head">
            <span className="mono dim">(04)</span>
            <h2 className="big">
              <Words text="By the *Numbers*" />
            </h2>
          </div>
          <div className="honors">
            <div>
              <span className="hn-star">✦</span>
              <span className="hn-big">B.Tech CSE</span>
              <span className="mono dim">ANITS · India</span>
            </div>
            <div>
              <span className="hn-star">✦</span>
              <span className="hn-big">Aspiring ML Engineer</span>
              <span className="mono dim">Machine Learning · AI · Data Science</span>
            </div>
          </div>
        </>,
        0.4
      )}

      {/* JOURNEY */}
      {JOURNEY.map((j, i) =>
        P(
          `journey${i}`,
          I[`journey${i}`],
          'pnl-journey',
          <>
            <span className="mono dim">(05) The Journey — 0{i + 1}</span>
            <div className="jy-year">
              {j.year.split('').map((c, k) => (
                <span key={k} className="jy-d">
                  <span style={{ transitionDelay: `${k * 0.06}s` }}>{c}</span>
                </span>
              ))}
            </div>
            <div className="jy-role">{j.role}</div>
            <div className="jy-place">{j.place}</div>
            <div className="mono dim jy-note">{j.note}</div>
          </>
        )
      )}

      {/* CERTS */}
      {P(
        'certs',
        I.certs,
        'pnl-certs',
        <>
          <div className="cert-heading">
            <div className="cert-heading-top">
              <span className="mono dim">(06) Credentials</span>
              <span className="mono cert-count">04 <span>/</span> COMPLETED</span>
            </div>
            <div className="cert-heading-main">
              <h2 className="big">
                <Words text="Proof of *practice*" />
              </h2>
              <p>Learning at the intersection of AI, software, and real-world impact.</p>
            </div>
          </div>
          <div className="cert-grid">
            {CERTS.map((cert, i) => (
              <article className="cert-card" key={cert.title} style={{ transitionDelay: `${0.08 + i * 0.07}s` }}>
                <div className="cert-card-main">
                  <div className="cert-card-head">
                    <span className="cert-mark" aria-hidden="true">{cert.mark}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                  </div>
                  <h3>{cert.title}</h3>
                  <p className="cert-description">{cert.description}</p>
                  <div className="cert-status">
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" />
                      <path d="m4.7 8.1 2.1 2.1 4.5-4.5" />
                    </svg>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="cert-card-art" aria-hidden="true">
                  {cert.image ? (
                    <img src={cert.image} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <>
                      <span className="cert-art-index">0{i + 1}</span>
                      <svg viewBox="0 0 48 48" fill="none">
                        <path d="M24 5.5 29 9l6.1-.2 1.9 5.8 5 3.5-1.8 5.8 1.8 5.9-5 3.5-1.9 5.8L29 39l-5 3.5L19 39l-6.1.2L11 33.4l-5-3.5 1.8-5.9L6 18.3l5-3.5 1.9-5.8L19 9l5-3.5Z" />
                        <path d="m17.5 24 4.2 4.2 8.8-8.8" />
                      </svg>
                      <span className="cert-art-label">CREDENTIAL</span>
                    </>
                  )}
                </div>
                {cert.credentialUrl && (
                  <a className="cert-link" href={cert.credentialUrl} target="_blank" rel="noreferrer">
                    View Credential <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </>,
        0.4
      )}

      {/* CONTACT */}
      {P('contact', I.contact, 'pnl-contact', <Contact />, 0.4)}

      <Nav show={ready} />
    </div>
  );
}

function Nav({ show }) {
  const tl = store.tl;
  const go = (id) => scrollToU(centerU(tl, tl.index[id]));
  return (
    <nav className={`nav ${show ? 'show' : ''}`}>
      <div className="nav-links">
        {[
          ['work0', 'Work'],
          ['skills', 'Skills'],
          ['journey0', 'Journey'],
          ['contact', 'Contact'],
        ].map(([id, label]) => (
          <button key={id} className="nav-link" onClick={() => go(id)}>
            <span className="nav-roll" data-text={label}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
