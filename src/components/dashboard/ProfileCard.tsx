"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getTierFromHours, formatHours } from "@/lib/utils";
import type { User } from "@/types";

const ProfileCard3D = dynamic(() => import("@/components/three/ProfileCard3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full skeleton rounded-xl" />,
});

const TIER_BADGE_VARIANT = {
  bronze: "bronze", silver: "silver", gold: "gold", platinum: "platinum",
} as const;

interface ProfileCardProps {
  user: User | null;
  loading?: boolean;
}

export default function ProfileCard({ user, loading }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    setTilt({ x, y });
  };

  if (loading || !user) {
    return (
      <div className="bento-card p-5 h-full flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-1.5 w-full mt-auto" />
      </div>
    );
  }

  const tierInfo = getTierFromHours(user.total_hours);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 200ms ease",
      }}
      className="bento-card p-5 h-full flex flex-col"
    >
      {/* 3D card visual */}
      <div className="h-36 w-full mb-4 rounded-xl overflow-hidden">
        <ProfileCard3D tier={user.tier} />
      </div>

      {/* Name + tier */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
            {user.name}
          </h3>
          <p className="text-xs mt-0.5 truncate max-w-[140px]" style={{ color: "var(--text-muted)" }}>
            {user.email}
          </p>
        </div>
        <Badge variant={TIER_BADGE_VARIANT[user.tier]}>{tierInfo.label}</Badge>
      </div>

      {/* Hours */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {formatHours(user.total_hours)}
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>hours</span>
      </div>

      {/* Tier progress */}
      <div className="mt-auto">
        {tierInfo.nextTier ? (
          <>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>{tierInfo.label}</span>
              <span>{tierInfo.nextTier - user.total_hours}h to next</span>
            </div>
            <Progress value={tierInfo.progress} />
          </>
        ) : (
          <p className="text-xs font-medium" style={{ color: "var(--violet)" }}>✦ Maximum tier achieved</p>
        )}
      </div>
    </motion.div>
  );
}
