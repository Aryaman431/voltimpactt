"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const IMPACT_LOCATIONS = [
  { lat: 40.7128,  lng: -74.006  }, // New York
  { lat: 51.5074,  lng: -0.1278  }, // London
  { lat: 35.6762,  lng: 139.6503 }, // Tokyo
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 48.8566,  lng: 2.3522   }, // Paris
  { lat: 37.7749,  lng: -122.419 }, // San Francisco
  { lat: 55.7558,  lng: 37.6173  }, // Moscow
  { lat: -23.5505, lng: -46.6333 }, // São Paulo
  { lat: 28.6139,  lng: 77.209   }, // New Delhi
  { lat: 1.3521,   lng: 103.8198 }, // Singapore
  { lat: 19.4326,  lng: -99.1332 }, // Mexico City
  { lat: 30.0444,  lng: 31.2357  }, // Cairo
  { lat: -26.2041, lng: 28.0473  }, // Johannesburg
  { lat: 59.9311,  lng: 30.3609  }, // St. Petersburg
  { lat: 41.0082,  lng: 28.9784  }, // Istanbul
];

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

// Dot cloud on sphere surface
function GlobePoints() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.52;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent color="#818cf8" size={0.008}
        sizeAttenuation depthWrite={false} opacity={0.55}
      />
    </Points>
  );
}

// Impact location markers — use elapsedTime to avoid setState in useFrame
function ImpactMarkers() {
  const groupRef  = useRef<THREE.Group>(null);
  // One ref per marker for the ring mesh so we can animate opacity
  const ringRefs  = useRef<(THREE.Mesh | null)[]>([]);

  const markerPositions = useMemo(
    () => IMPACT_LOCATIONS.map((loc) => latLngToVec3(loc.lat, loc.lng, 1.52)),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;

    const t = state.clock.elapsedTime;
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const pulse = Math.sin(t * 2 + i * 0.8) * 0.5 + 0.5;
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 - pulse * 0.4;
      const inner = 0.018 + pulse * 0.02;
      const outer = 0.022 + pulse * 0.02;
      // Update ring geometry radii
      ring.geometry.dispose();
      ring.geometry = new THREE.RingGeometry(inner, outer, 16);
    });
  });

  return (
    <group ref={groupRef}>
      {markerPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
          </mesh>
          {/* Animated pulse ring */}
          <mesh
            ref={(el) => { ringRefs.current[i] = el; }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.018, 0.022, 16]} />
            <meshBasicMaterial
              color="#818cf8" transparent opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Main globe sphere
function GlobeMesh({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const ref    = useRef<THREE.Mesh>(null);
  const rotY   = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    rotY.current += delta * 0.05;
    ref.current.rotation.x += (mouseY * 0.3 - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y  = rotY.current + mouseX * 0.3;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhongMaterial
        color="#0d0f18" emissive="#160e30"
        emissiveIntensity={0.25} transparent opacity={0.96}
      />
    </mesh>
  );
}

// Wireframe overlay
function GlobeWireframe({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const ref  = useRef<THREE.Mesh>(null);
  const rotY = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    rotY.current += delta * 0.05;
    ref.current.rotation.x = mouseY * 0.3;
    ref.current.rotation.y = rotY.current + mouseX * 0.3;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.51, 32, 32]} />
      <meshBasicMaterial color="#4338ca" wireframe transparent opacity={0.07} />
    </mesh>
  );
}

// Soft atmosphere halo
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.65, 32, 32]} />
      <meshBasicMaterial color="#4f46e5" transparent opacity={0.04} side={THREE.BackSide} />
    </mesh>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]}   intensity={1.5} color="#818cf8" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[0, 5, -5]}  intensity={0.3} color="#a78bfa" />
      <Atmosphere />
      <GlobeMesh mouseX={mouseX} mouseY={mouseY} />
      <GlobeWireframe mouseX={mouseX} mouseY={mouseY} />
      <GlobePoints />
      <ImpactMarkers />
    </>
  );
}

export default function ImpactGlobe() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene mouseX={mouse.x} mouseY={mouse.y} />
      </Canvas>
    </div>
  );
}
