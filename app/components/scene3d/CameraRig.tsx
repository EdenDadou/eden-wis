import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { Experience as ExperienceType } from "../Timeline3D";
import { ORBIT_RADIUS } from "./camera.constants";
import { getCameraPositionForSection, getSkillGroup } from "./camera.utils";

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
  const navTransitionType = useRef<'skill-same' | 'skill-different' | 'hero' | 'major'>('major');

  useFrame((state, delta) => {
    // Handle navigation to target section
    if (targetSection !== lastTargetSection.current) {
      // Calculate animation duration based on transition type BEFORE updating lastTargetSection
      const prevSection = lastTargetSection.current ?? 0;
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

      // Determine transition type
      const isSkillTransition = prevSection >= 1 && prevSection <= 9 && targetSection >= 1 && targetSection <= 9;
      const isSameSkillGroup = getSkillGroup(prevSection) === getSkillGroup(targetSection);
      const isHeroTransition = prevSection === 0 || targetSection === 0;
      const isMajorSectionTransition = !isSkillTransition && !isHeroTransition;

      let baseDuration: number;
      let maxDuration: number;

      if (isSkillTransition && isSameSkillGroup) {
        // Same skill group: quick vertical slide
        baseDuration = 0.4;
        maxDuration = 0.6;
        navTransitionType.current = 'skill-same';
      } else if (isSkillTransition) {
        // Different skill groups: smooth horizontal arc
        baseDuration = 0.6;
        maxDuration = 0.9;
        navTransitionType.current = 'skill-different';
      } else if (isHeroTransition) {
        // Hero to/from skills: cinematic zoom
        baseDuration = 0.7;
        maxDuration = 1.0;
        navTransitionType.current = 'hero';
      } else if (isMajorSectionTransition) {
        // Between major sections
        baseDuration = 0.8;
        maxDuration = 1.2;
        navTransitionType.current = 'major';
      } else {
        baseDuration = 0.8;
        maxDuration = 1.2;
        navTransitionType.current = 'major';
      }

      // Scale duration slightly with distance but keep it snappy
      navAnimationDuration.current = Math.min(
        maxDuration,
        baseDuration + distance * 0.008
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
      const transitionType = navTransitionType.current;

      // Different easing curves based on transition type
      let easePosition: number;
      let easeLookAt: number;

      if (transitionType === 'skill-same') {
        // Snappy ease-out quartic for vertical slides within same group
        easePosition = 1 - Math.pow(1 - t, 4);
        easeLookAt = 1 - Math.pow(1 - t, 3);
      } else if (transitionType === 'skill-different') {
        // Smooth ease-in-out for horizontal movement between groups
        const easeInOut = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        easePosition = easeInOut;
        easeLookAt = 1 - Math.pow(1 - t, 2.5);
      } else if (transitionType === 'hero') {
        // Cinematic ease-out expo for dramatic zoom effect
        easePosition = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        easeLookAt = 1 - Math.pow(1 - t, 2);
      } else {
        // Standard smooth ease-out cubic for major sections
        easePosition = 1 - Math.pow(1 - t, 3);
        easeLookAt = 1 - Math.pow(1 - t, 2.5);
      }

      // Calculate base interpolated position
      let x = THREE.MathUtils.lerp(
        navStartPos.current.x,
        navTargetPos.current.x,
        easePosition
      );
      let y = THREE.MathUtils.lerp(
        navStartPos.current.y,
        navTargetPos.current.y,
        easePosition
      );
      let z = THREE.MathUtils.lerp(
        navStartPos.current.z,
        navTargetPos.current.z,
        easePosition
      );

      // Add arc effects for dynamic camera movement
      if (transitionType === 'skill-different') {
        // Pull back arc for horizontal transitions between skill groups
        const arcHeight = Math.sin(t * Math.PI) * 1.2;
        z += arcHeight;
      } else if (transitionType === 'hero') {
        // Subtle arc for hero transitions
        const arcHeight = Math.sin(t * Math.PI) * 0.3;
        z += arcHeight;
      }

      const lookAtX = THREE.MathUtils.lerp(
        navStartLookAt.current.x,
        navTargetLookAt.current.x,
        easeLookAt
      );
      const lookAtY = THREE.MathUtils.lerp(
        navStartLookAt.current.y,
        navTargetLookAt.current.y,
        easeLookAt
      );
      const lookAtZ = THREE.MathUtils.lerp(
        navStartLookAt.current.z,
        navTargetLookAt.current.z,
        easeLookAt
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

    // Smooth damping for steady-state camera following
    easing.damp3(state.camera.position, targetPos, 0.12, delta);
    state.camera.lookAt(lookAt);
  });

  return null;
}
