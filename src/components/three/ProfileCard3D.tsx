"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Tier = "bronze" | "silver" | "gold" | "platinum";

const TIER_MATERIALS: Record<Tier, {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
}> = {
  bronze: {
    color: "#cd7f32",
    emissive: "#7c4a1e",
    emissiveIntensity: 0.2,
    metalness: 0.6,
    roughness: 0.4,
  },
  silver: {
    color: "#c0c0c0",
    emissive: "#606060",
    emissiveIntensity: 0.15,
    metalness: 0.8,
    roughness: 0.2,
  },
  gold: {
    color: "#ffd700",
    emissive: "#b8860b",
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1,
  },
  platinum: {
    color: "#e5e4e2",
    emissive: "#9b9b9b",
    emissiveIntensity: 0.4,
    metalness: 1.0,
    roughness: 0.05,
  },
};

function Card3D({ tier, mouseX, mouseY }: { tier: Tier; mouseX: number; mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = TIER_MATERIALS[tier];

  useFrame(() => {
    if (!meshRef.current) return;
    const targetX = mouseY * 0.3;
    const targetY = mouseX * 0.3;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.08;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={mat.color} />
      <spotLight position={[0, 5, 2]} intensity={1.5} angle={0.4} penumbra={0.5} />

      <mesh ref={meshRef}>
        <RoundedBox args={[3.2, 2, 0.08]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color={mat.color}
            emissive={mat.emissive}
            emissiveIntensity={mat.emissiveIntensity}
            metalness={mat.metalness}
            roughness={mat.roughness}
          />
        </RoundedBox>
      </mesh>

      {/* Holographic shimmer for platinum */}
      {tier === "platinum" && (
        <mesh position={[0, 0, 0.05]}>
          <RoundedBox args={[3.2, 2, 0.01]} radius={0.12} smoothness={4}>
            <meshBasicMaterial
              color="#a78bfa"
              transparent
              opacity={0.08}
            />
          </RoundedBox>
        </mesh>
      )}
    </>
  );
}

interface ProfileCard3DProps {
  tier: Tier;
  className?: string;
}

export default function ProfileCard3D({ tier, className = "" }: ProfileCard3DProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  };

  const handleMouseLeave = () => setMouse({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      className={`w-full h-full cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Card3D tier={tier} mouseX={mouse.x} mouseY={mouse.y} />
      </Canvas>
    </div>
  );
}
