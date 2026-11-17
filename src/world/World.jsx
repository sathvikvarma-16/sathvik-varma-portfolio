import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { store } from '../store.js';
import { sample } from '../timeline.js';
import Hero from './Hero.jsx';
import Gate from './Gate.jsx';
import Gallery from './Gallery.jsx';
import Constellation from './Constellation.jsx';
import Towers from './Towers.jsx';
import Corridor from './Corridor.jsx';
import CertOrbit from './CertOrbit.jsx';
import Horizon from './Horizon.jsx';
import { Floor, Dust, GroundMist } from './Environment.jsx';

function CameraRig() {
  const { camera } = useThree();
  const P = useMemo(() => new THREE.Vector3(), []);
  const Lk = useMemo(() => new THREE.Vector3(), []);
  const roll = useMemo(() => ({ v: 0 }), []);
  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 30);
    store.off += (store.target - store.off) * (1 - Math.exp(-d * 10.5));
    store.smouse.x += (store.mouse.x - store.smouse.x) * (1 - Math.exp(-d * 10));
    store.smouse.y += (store.mouse.y - store.smouse.y) * (1 - Math.exp(-d * 10));
    const info = sample(store.tl, store.off, P, Lk);
    // parallax
    P.x += store.smouse.x * 0.35;
    P.y += -store.smouse.y * 0.18;
    camera.position.copy(P);
    // bank into lateral moves
    const targetRoll = info.travel ? Math.sin(info.t * Math.PI) * 0.06 * -info.dir : 0;
    roll.v += (targetRoll - roll.v) * (1 - Math.exp(-d * 3));
    camera.up.set(Math.sin(roll.v), Math.cos(roll.v), 0);
    camera.lookAt(Lk);
  });
  return null;
}

function ScenePrewarm() {
  const { gl, scene, camera } = useThree();
  const queued = useRef(false);
  const idleTask = useRef(null);

  useFrame(() => {
    if (queued.current || !store.ready) return;
    queued.current = true;

    const warm = () => {
      idleTask.current = null;
      const warmScene = scene.clone(true);
      const textures = new Set();
      warmScene.traverse((object) => {
        object.visible = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!material) return;
          if (material.map?.isTexture) textures.add(material.map);
          Object.values(material.uniforms || {}).forEach((uniform) => {
            const value = uniform.value;
            if (value?.isTexture) textures.add(value);
            else if (Array.isArray(value)) value.forEach((item) => item?.isTexture && textures.add(item));
          });
        });
      });

      try {
        textures.forEach((texture) => gl.initTexture(texture));
        warmScene.updateMatrixWorld(true);
        camera.updateMatrixWorld();
        if (typeof gl.compileAsync === 'function') {
          gl.compileAsync(warmScene, camera).then(
            () => warmScene.clear(),
            (error) => {
              warmScene.clear();
              console.error('Scene shader prewarm failed', error);
            }
          );
        } else {
          gl.compile(warmScene, camera);
          warmScene.clear();
        }
      } catch (error) {
        warmScene.clear();
        console.error('Scene prewarm failed', error);
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleTask.current = { kind: 'idle', id: window.requestIdleCallback(warm, { timeout: 2000 }) };
    } else {
      idleTask.current = { kind: 'timeout', id: window.setTimeout(warm, 100) };
    }
  });

  useEffect(
    () => () => {
      if (!idleTask.current) return;
      if (idleTask.current.kind === 'idle') window.cancelIdleCallback(idleTask.current.id);
      else window.clearTimeout(idleTask.current.id);
    },
    []
  );

  return null;
}

export default function World() {
  const mobile = store.mobile;
  return (
    <>
      <color attach="background" args={['#09090a']} />
      <fogExp2 attach="fog" args={['#09090a', 0.042]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={['#c9c9d2', '#050505', 0.35]} />
      <CameraRig />
      <ScenePrewarm />
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
      <Gate />
      <Gallery />
      <Constellation />
      <Towers />
      <Corridor />
      <CertOrbit />
      <Horizon />
      <Floor />
      <Dust />
      <GroundMist />
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom mipmapBlur intensity={mobile ? 0.8 : 1.05} luminanceThreshold={0.62} luminanceSmoothing={0.25} radius={0.75} />
        <Noise opacity={0.16} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.75} />
        <SMAA />
      </EffectComposer>
    </>
  );
}
