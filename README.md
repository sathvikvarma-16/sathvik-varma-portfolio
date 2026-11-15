# Sathvik Varma — Portfolio

An immersive 3D portfolio for Sathvik Varma, a Computer Science Engineering student at ANITS and aspiring Machine Learning Engineer. Scrolling moves the camera through a cinematic world of interactive portfolio sections.

## Experience

| Section | Experience |
| --- | --- |
| **Smoke chamber** | Particle text morphs from *SATHVIK VARMA* to *MACHINE LEARNING* as a configurable portrait reveals through shader smoke |
| **Portal** | A breathing ring of particles frames the introduction |
| **Monolith gallery** | Glass slabs display animated project artwork and project details for every entry in `src/content.js` |
| **Constellation** | Skills form an interactive 3D neural network with travelling signals |
| **Towers of light** | Configurable academic and project statistics rise from the floor |
| **Corridor of time** | Four stops trace school, intermediate, university, and technical learning |
| **Certificate orbit** | Configurable certificate cards orbit a light core |
| **Horizon** | A moon rises over the mist for the contact section |

## Tech

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Three.js](https://threejs.org) via [React Three Fiber](https://r3f.docs.pmnd.rs) and [drei](https://github.com/pmndrs/drei)
- Custom GLSL shaders for particle morphing, portrait smoke, ground mist, and the moon
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing): bloom, film grain, vignette, SMAA
- [Lenis](https://lenis.darkroom.engineering) smooth scrolling
- Self-hosted Inter Tight, Instrument Serif, and JetBrains Mono fonts

## Run locally

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build
```

Deploy the generated `dist/` folder to a static host.

## Personal configuration

Update `src/content.js` to edit the profile, projects, skills, statistics, journey, contact links, and verified certifications.

- The uploaded portrait is included at `src/assets/sathvik-portrait.png`. Set `PORTRAIT_URL` in `src/content.js` only to override it with another portrait URL or path served from `public/`.
- Add the LinkedIn URL, email address, and résumé PDF path to `CONTACT`. Unconfigured links are not shown.
- Add only earned certifications to `CERTS`; each entry is `[issuer, certificate title]`.
- Update `STATS` with genuine values. The default entries cover coding problems solved, technical projects, and core technologies.

## Project structure

```
src/
  content.js        portfolio content and configurable personal details
  timeline.js       camera path, room positions, and scroll timing
  store.js          shared per-frame state
  App.jsx           canvas, overlay, and scroll setup
  lib/scroll.js     Lenis smooth scroll
  world/            3D rooms and animations
  ui/               HTML overlay, navigation, cursor, and contact links
```
