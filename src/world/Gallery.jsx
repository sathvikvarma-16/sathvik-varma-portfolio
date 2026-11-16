import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { L, FLOOR } from '../timeline.js';
import { store } from '../store.js';
import { PROJECTS } from '../content.js';

const SW = 512;
const SH = 900;
const RES = 1.25;

function drawProject(g, t, project, index) {
  g.fillStyle = '#0b0b0c';
  g.fillRect(0, 0, SW, SH);

  const bg = g.createLinearGradient(0, 100, SW, SH);
  bg.addColorStop(0, 'rgba(255,255,255,.07)');
  bg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = bg;
  g.fillRect(0, 100, SW, SH - 100);

  g.font = '500 16px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.48)';
  g.fillText('SATHVIK VARMA', 42, 62);
  g.textAlign = 'right';
  g.fillText(`PROJECT 0${index + 1}`, SW - 42, 62);
  g.textAlign = 'left';

  g.strokeStyle = 'rgba(255,255,255,.16)';
  g.beginPath();
  g.moveTo(42, 92);
  g.lineTo(SW - 42, 92);
  g.stroke();

  g.fillStyle = 'rgba(255,255,255,.5)';
  g.font = '500 18px "JetBrains Mono"';
  g.fillText(project.tag.toUpperCase(), 42, 160);
  g.fillStyle = '#f4f4f6';
  g.font = '400 52px "Instrument Serif"';
  const words = project.title.split(' ');
  let line = '';
  let y = 247;
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > SW - 84 && line) {
      g.fillText(line, 42, y);
      y += 62;
      line = word;
    } else {
      line = next;
    }
  });
  if (line) g.fillText(line, 42, y);

  const cx = SW / 2;
  const cy = 525;
  const phase = t * 0.7 + index * 1.3;
  for (let ring = 0; ring < 4; ring++) {
    g.beginPath();
    g.ellipse(cx, cy, 70 + ring * 38, 42 + ring * 23, phase * (ring % 2 ? -0.08 : 0.08), 0, Math.PI * 2);
    g.strokeStyle = `rgba(255,255,255,${0.1 + (ring === 0 ? 0.16 : 0)})`;
    g.lineWidth = 1.5;
    g.stroke();
  }
  for (let dot = 0; dot < 7; dot++) {
    const angle = phase + (dot / 7) * Math.PI * 2;
    const radius = 72 + (dot % 3) * 38;
    const x = cx + Math.cos(angle) * radius;
    const yy = cy + Math.sin(angle) * radius * 0.62;
    g.fillStyle = 'rgba(255,255,255,.82)';
    g.beginPath();
    g.arc(x, yy, dot === 0 ? 5 : 2.5, 0, Math.PI * 2);
    g.fill();
  }

  g.strokeStyle = 'rgba(255,255,255,.25)';
  g.beginPath();
  g.moveTo(42, 730);
  g.lineTo(SW - 42, 730);
  g.stroke();
  g.fillStyle = 'rgba(255,255,255,.5)';
  g.font = '500 14px "JetBrains Mono"';
  g.fillText('PORTFOLIO PROJECT', 42, 778);
  g.textAlign = 'right';
  g.fillText(`0${index + 1} / 0${PROJECTS.length}`, SW - 42, 778);
  g.textAlign = 'left';
}

function Monolith({ i, pos }) {
  const root = useRef();
  const body = useRef();
  const { canvas, tex } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SW * RES;
    c.height = SH * RES;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: c, tex: t };
  }, []);
  const ctx = useMemo(() => {
    const g = canvas.getContext('2d');
    g.setTransform(RES, 0, 0, RES, 0, 0);
    return g;
  }, [canvas]);
  const shot = useMemo(() => store.tl.shots[store.tl.index[`work${i}`]], [i]);
  const yaw = useMemo(() => Math.atan2(shot.pos.x - pos.x, shot.pos.z - pos.z), [shot, pos]);
  const beamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uO: { value: 0.0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
        fragmentShader:
          'varying vec2 vUv; uniform float uO; void main(){ float a = pow(vUv.y,2.2)*0.13*uO; a*= 0.6+0.4*sin(vUv.x*6.2832*3.0); gl_FragColor=vec4(vec3(1.0),a);} ',
      }),
    []
  );
  const lastDraw = useRef(0);

  useFrame((s) => {
    const d = Math.abs(s.camera.position.z - pos.z);
    root.current.visible = d < 50;
    if (!root.current.visible) return;
    const t = s.clock.elapsedTime;
    if (d < 32 && (lastDraw.current === 0 || t - lastDraw.current >= 1 / 24)) {
      drawProject(ctx, t, PROJECTS[i], i);
      tex.needsUpdate = true;
      lastDraw.current = t;
    }
    body.current.position.y = Math.sin(t * 0.7 + i) * 0.06;
    body.current.rotation.y = yaw + Math.sin(t * 0.35 + i) * 0.05;
    beamMat.uniforms.uO.value = THREE.MathUtils.clamp(1.4 - d / 18, 0.15, 1);
  });

  const W = 2.5, H = 4.3, D = 0.22;
  return (
    <group ref={root} position={[pos.x, 0, pos.z]}>
      <group ref={body}>
        <mesh>
          <boxGeometry args={[W, H, D]} />
          <meshPhysicalMaterial color="#0d0d0f" metalness={0.9} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
          <lineBasicMaterial color="#cfcfd6" transparent opacity={0.55} />
        </lineSegments>
        <mesh position={[0, 0, D / 2 + 0.004]}>
          <planeGeometry args={[W - 0.16, H - 0.16]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, FLOOR + 6.5, 0]} material={beamMat}>
        <cylinderGeometry args={[0.35, 2.6, 13, 32, 1, true]} />
      </mesh>
      <spotLight position={[0, 7, 1.5]} angle={0.45} penumbra={0.9} intensity={60} distance={16} color="#e6e6ee" />
    </group>
  );
}

export default function Gallery() {
  return (
    <>
      {L.m.map((p, i) => (
        <Monolith key={i} i={i} pos={p} />
      ))}
    </>
  );
}
