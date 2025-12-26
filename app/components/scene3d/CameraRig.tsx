import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { Experience as ExperienceType } from "../Timeline3D";
import { ORBIT_RADIUS } from "./camera.constants";
import { getCameraPositionForSection } from "./camera.utils";

export interface CameraRigProps {
  selectedExperience: ExperienceType | null;
  targetSection: number;
  onNavigationComplete?: () => void;
}

export default function CameraRig({
  selectedExperience,
  targetSection,
  onNavigationComplete,
}: CameraRigProps) {
  const isInDetailView = selectedExperience !== null;
  const lastTargetSection = useRef<number | null>(null);
  const navigationCompleted = useRef(true);

  // Animation state for navigation
  const navAnimationProgress = useRef(0);
  const navAnimationActive = useRef(false);
  const navStartPos = useRef(new THREE.Vector3());
  const navTargetPos = useRef(new THREE.Vector3());
  const navTargetLookAt = useRef(new THREE.Vector3());
  const navStartLookAt = useRef(new THREE.Vector3());
  const navAnimationDuration = useRef(1.2);

  useFrame((state, delta) => {
    // Handle navigation to target section
    if (targetSection !== lastTargetSection.current) {
      lastTargetSection.current = targetSection;
      navigationCompleted.current = false;

      const pos = getCameraPositionForSection(targetSection);

      navStartPos.current.copy(state.camera.position);
      navTargetPos.current.set(pos.x, pos.y, pos.z);
      navTargetLookAt.current.set(pos.lookX, pos.lookY, pos.lookZ ?? 0);

      const currentLookAt = new THREE.Vector3();
      state.camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(state.camera.position);
      navStartLookAt.current.copy(currentLookAt);

      const distance = navStartPos.current.distanceTo(navTargetPos.current);

      // Longer, smoother duration for hero -> skills transition
      let baseDuration: number;
      let maxDuration: number;

      baseDuration = 1.0;
      maxDuration = 1.8;

      navAnimationDuration.current = Math.min(
        maxDuration,
        Math.max(baseDuration, baseDuration + distance * 0.02)
      );

      navAnimationProgress.current = 0;
      navAnimationActive.current = true;
    }

    // Animate camera during navigation
    if (navAnimationActive.current) {
      navAnimationProgress.current += delta / navAnimationDuration.current;

      if (navAnimationProgress.current >= 1) {
        navAnimationProgress.current = 1;
        navAnimationActive.current = false;
        if (!navigationCompleted.current && onNavigationComplete) {
          navigationCompleted.current = true;
          onNavigationComplete();
        }
      }

      const t = navAnimationProgress.current;

      // Smooth ease-in-out cubic for all transitions (no abrupt changes)
      const easeCustom =
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Direct interpolation without zoom-out arc effect
      const x = THREE.MathUtils.lerp(
        navStartPos.current.x,
        navTargetPos.current.x,
        easeCustom
      );
      const y = THREE.MathUtils.lerp(
        navStartPos.current.y,
        navTargetPos.current.y,
        easeCustom
      );
      const z = THREE.MathUtils.lerp(
        navStartPos.current.z,
        navTargetPos.current.z,
        easeCustom
      );

      const lookAtX = THREE.MathUtils.lerp(
        navStartLookAt.current.x,
        navTargetLookAt.current.x,
        easeCustom
      );
      const lookAtY = THREE.MathUtils.lerp(
        navStartLookAt.current.y,
        navTargetLookAt.current.y,
        easeCustom
      );
      const lookAtZ = THREE.MathUtils.lerp(
        navStartLookAt.current.z,
        navTargetLookAt.current.z,
        easeCustom
      );

      state.camera.position.set(x, y, z);
      state.camera.lookAt(lookAtX, lookAtY, lookAtZ);
      return;
    }

    // Get target camera position
    const pos = getCameraPositionForSection(targetSection);
    let { x, y, z, lookX, lookY, lookZ } = pos;

    // Override camera position when in detail view
    if (isInDetailView) {
      x = 0;
      y = 0;
      z = ORBIT_RADIUS + 7;
      lookX = 0;
      lookY = 0;
      lookZ = ORBIT_RADIUS;
    }

    // Add subtle drift for life
    if (!isInDetailView) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.15) * 0.03;
      y += Math.cos(time * 0.2) * 0.03;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, lookZ ?? 0);

    easing.damp3(state.camera.position, targetPos, 0.08, delta);
    state.camera.lookAt(lookAt);
  });

  return null;
}
