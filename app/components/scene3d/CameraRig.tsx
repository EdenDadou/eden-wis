import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { Experience as ExperienceType } from "../Timeline3D";
import {
  ORBIT_RADIUS,
  SECTION_SNAP_OFFSETS,
} from "./camera.constants";
import {
  easeInOutQuint,
  easeOutExpo,
  getSectionOffset,
  getSectionFromOffset,
  getCameraPositionForSection,
  getInterpolatedCameraPosition,
} from "./camera.utils";

export interface CameraRigProps {
  selectedExperience: ExperienceType | null;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
  snapOffset: number | null;
  onRequestSnap: (offset: number) => void;
}

export default function CameraRig({
  selectedExperience,
  targetSection,
  onNavigationComplete,
  snapOffset,
  onRequestSnap,
}: CameraRigProps) {
  const scroll = useScroll();
  const isInDetailView = selectedExperience !== null;
  const lastTargetSection = useRef<number | null>(null);
  const forcedOffset = useRef<number | null>(null);
  const forceFramesRemaining = useRef(0);
  const navigationCompleted = useRef(true);

  // Natural scroll snap - velocity-based detection
  const scrollHistory = useRef<number[]>([]);
  const isSnapping = useRef(false);
  const snapTarget = useRef<number | null>(null);

  // Animation state for menu navigation
  const navAnimationProgress = useRef(0);
  const navAnimationActive = useRef(false);
  const navStartPos = useRef(new THREE.Vector3());
  const navTargetPos = useRef(new THREE.Vector3());
  const navTargetLookAt = useRef(new THREE.Vector3());
  const navStartLookAt = useRef(new THREE.Vector3());
  const navAnimationDuration = useRef(1.2);

  useFrame((state, delta) => {
    const currentOffset = scroll.offset;

    // Track scroll velocity for natural snap detection
    scrollHistory.current.push(currentOffset);
    if (scrollHistory.current.length > 10) {
      scrollHistory.current.shift();
    }

    // Calculate scroll velocity
    const velocity =
      scrollHistory.current.length > 1
        ? Math.abs(
            scrollHistory.current[scrollHistory.current.length - 1] -
              scrollHistory.current[0]
          ) / scrollHistory.current.length
        : 0;

    // Natural snap: only trigger when scroll velocity is very low
    const currentSec = getSectionFromOffset(currentOffset);
    const isInSkillsSection = currentSec >= 1 && currentSec <= 12;

    if (
      isInSkillsSection &&
      !navAnimationActive.current &&
      forcedOffset.current === null
    ) {
      if (velocity < 0.0003 && !isSnapping.current) {
        const targetSnapOffset = SECTION_SNAP_OFFSETS[currentSec];
        const distanceToSnap = Math.abs(currentOffset - targetSnapOffset);

        if (distanceToSnap > 0.008) {
          isSnapping.current = true;
          snapTarget.current = targetSnapOffset;
          onRequestSnap(targetSnapOffset);
        }
      }
    }

    // Smooth snap animation
    if (
      snapOffset !== null &&
      scroll.el &&
      !navAnimationActive.current &&
      forcedOffset.current === null
    ) {
      const targetScrollTop =
        snapOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
      const currentScrollTop = scroll.el.scrollTop;
      const diff = targetScrollTop - currentScrollTop;

      const distance = Math.abs(diff);
      const baseSpeed = 0.06;
      const adaptiveSpeed = baseSpeed + Math.min(0.08, distance * 0.00008);
      const decay = 1 - Math.exp(-adaptiveSpeed * 60);

      if (distance > 0.5) {
        scroll.el.scrollTop = currentScrollTop + diff * decay;
      } else {
        scroll.el.scrollTop = targetScrollTop;
        isSnapping.current = false;
        snapTarget.current = null;
      }
    } else {
      isSnapping.current = false;
    }

    // Handle direct navigation from menu
    if (
      targetSection !== null &&
      targetSection !== undefined &&
      targetSection !== lastTargetSection.current
    ) {
      lastTargetSection.current = targetSection;
      const targetOffset = getSectionOffset(targetSection);

      forcedOffset.current = targetOffset;
      forceFramesRemaining.current = 90;
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
      const isSkillNavigation = targetSection >= 1 && targetSection <= 12;
      const baseDuration = isSkillNavigation ? 0.7 : 1.0;
      const maxDuration = isSkillNavigation ? 1.0 : 1.8;
      navAnimationDuration.current = Math.min(
        maxDuration,
        Math.max(baseDuration, baseDuration + distance * 0.025)
      );

      navAnimationProgress.current = 0;
      navAnimationActive.current = true;
    }

    // Keep forcing scroll position while forcedOffset is active
    if (forcedOffset.current !== null && scroll.el) {
      scroll.el.scrollTop =
        forcedOffset.current *
        (scroll.el.scrollHeight - scroll.el.clientHeight);

      forceFramesRemaining.current--;

      const diff = Math.abs(scroll.offset - forcedOffset.current);
      if (
        forceFramesRemaining.current <= 0 &&
        diff < 0.01 &&
        !navAnimationActive.current
      ) {
        forcedOffset.current = null;
        if (!navigationCompleted.current && onNavigationComplete) {
          navigationCompleted.current = true;
          onNavigationComplete();
        }
      }
    }

    // Animate camera during navigation
    if (navAnimationActive.current) {
      navAnimationProgress.current += delta / navAnimationDuration.current;

      if (navAnimationProgress.current >= 1) {
        navAnimationProgress.current = 1;
        navAnimationActive.current = false;
      }

      const t = navAnimationProgress.current;

      const easeCustom =
        t < 0.3
          ? easeInOutQuint(t / 0.3) * 0.4
          : 0.4 + easeOutExpo((t - 0.3) / 0.7) * 0.6;

      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      const zoomOutAmount = Math.min(6, Math.max(2, distance * 0.25));

      const smootherstep = t * t * t * (t * (t * 6 - 15) + 10);
      const bellBase = Math.sin(smootherstep * Math.PI);
      const zoomCurve = Math.pow(bellBase, 0.7);

      const liftAmount = Math.min(2.5, Math.max(0.8, distance * 0.12));

      const x = THREE.MathUtils.lerp(
        navStartPos.current.x,
        navTargetPos.current.x,
        easeCustom
      );
      const baseY = THREE.MathUtils.lerp(
        navStartPos.current.y,
        navTargetPos.current.y,
        easeCustom
      );
      const y = baseY + zoomCurve * liftAmount;
      const baseZ = THREE.MathUtils.lerp(
        navStartPos.current.z,
        navTargetPos.current.z,
        easeCustom
      );
      const z = baseZ + zoomCurve * zoomOutAmount;

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

    // Reset when targetSection becomes null
    if (targetSection === null && lastTargetSection.current !== null) {
      lastTargetSection.current = null;
    }

    const offset =
      forcedOffset.current !== null ? forcedOffset.current : scroll.offset;

    const camPos = getInterpolatedCameraPosition(offset);
    let { x, y, z, lookX, lookY, lookZ } = camPos;

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
    if (
      !isInDetailView &&
      forcedOffset.current === null &&
      !isSnapping.current
    ) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.15) * 0.03;
      y += Math.cos(time * 0.2) * 0.03;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, lookZ);

    const dampFactor = isSnapping.current ? 0.06 : 0.08;

    if (forcedOffset.current !== null) {
      easing.damp3(state.camera.position, targetPos, 0.05, delta);
    } else {
      easing.damp3(state.camera.position, targetPos, dampFactor, delta);
    }

    state.camera.lookAt(lookAt);
  });

  return null;
}
