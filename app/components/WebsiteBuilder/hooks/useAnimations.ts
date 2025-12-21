import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { DEZOOM_START, DEZOOM_END, BASE_X_OFFSET, SECTION_MAP } from "../constants";

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

interface UseAnimationsProps {
  currentSection: number;
  refs: {
    sceneRef: React.RefObject<THREE.Group | null>;
    serverRef: React.RefObject<THREE.Group | null>;
    databaseRef: React.RefObject<THREE.Group | null>;
    backofficeRef: React.RefObject<THREE.Group | null>;
    archiRef: React.RefObject<THREE.Group | null>;
    cloudRef: React.RefObject<THREE.Group | null>;
    mobileRef: React.RefObject<THREE.Group | null>;
    frontendRef: React.RefObject<THREE.Group | null>;
    cicdRef: React.RefObject<THREE.Group | null>;
    frontendBoxMatRef: React.RefObject<THREE.MeshBasicMaterial | null>;
    backendBoxMatRef: React.RefObject<THREE.MeshBasicMaterial | null>;
    devopsBoxMatRef: React.RefObject<THREE.MeshBasicMaterial | null>;
    frontendLabelRef: React.RefObject<any>;
    backendLabelRef: React.RefObject<any>;
    devopsLabelRef: React.RefObject<any>;
    skillsContainerRef: React.RefObject<THREE.Group | null>;
    bladeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
    databaseRingRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
    chatBubbleRefs: React.MutableRefObject<(THREE.Group | null)[]>;
    chartRefs: React.MutableRefObject<(THREE.Line | THREE.Mesh | THREE.Group | null)[]>;
    pipelineNodeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
    cloudNodeRefs: React.MutableRefObject<(THREE.Mesh | THREE.Group | null)[]>;
    checklistRefs: React.MutableRefObject<(THREE.Group | null)[]>;
    uiBlock1: React.RefObject<THREE.Group | null>;
    uiBlock2: React.RefObject<THREE.Group | null>;
    uiBlock3: React.RefObject<THREE.Group | null>;
  };
}

export function useAnimations({ currentSection, refs }: UseAnimationsProps) {
  const scroll = useScroll();

  // Time tracking refs
  const enteredSection1Time = useRef<number | null>(null);
  const hasTriggeredEntryAnimation = useRef(false);
  const categoryBoxOpacity = useRef(0);

  // Animation timing refs
  const serverVisibleTime = useRef<number | null>(null);
  const databaseVisibleTime = useRef<number | null>(null);
  const mobileVisibleTime = useRef<number | null>(null);
  const backofficeVisibleTime = useRef<number | null>(null);
  const cicdVisibleTime = useRef<number | null>(null);
  const cloudVisibleTime = useRef<number | null>(null);
  const archiVisibleTime = useRef<number | null>(null);
  const serverLedIntensity = useRef(0);

  useFrame((state) => {
    if (!refs.sceneRef.current) return;
    const offset = scroll.offset;

    // ============ TIME-BASED ENTRY ANIMATION FOR SECTION 1 ============
    if (currentSection >= 1 && enteredSection1Time.current === null) {
      enteredSection1Time.current = state.clock.elapsedTime;
      hasTriggeredEntryAnimation.current = true;
    }

    if (currentSection === 0) {
      enteredSection1Time.current = null;
      hasTriggeredEntryAnimation.current = false;
      categoryBoxOpacity.current = 0;
    }

    // ============ CATEGORY BOX FADE-IN ============
    if (enteredSection1Time.current !== null) {
      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const fadeDelay = 0.3;
      const fadeDuration = 0.6;
      const fadeProgress = Math.max(0, Math.min((elapsed - fadeDelay) / fadeDuration, 1));
      categoryBoxOpacity.current = easeOutCubic(fadeProgress);

      const baseOpacity = categoryBoxOpacity.current;
      const isFrontendActive = currentSection >= 2 && currentSection <= 5;
      const isBackendActive = currentSection >= 6 && currentSection <= 8;
      const isDevopsActive = currentSection >= 9 && currentSection <= 12;

      const isInDetailSection =
        (currentSection >= 3 && currentSection <= 5) ||
        (currentSection >= 7 && currentSection <= 8) ||
        (currentSection >= 10 && currentSection <= 12);

      const dimmedOpacity = 0.08;

      if (refs.frontendBoxMatRef.current) {
        const activeOpacity = isFrontendActive ? 0.7 : 0.4;
        const finalOpacity = isInDetailSection && !isFrontendActive ? dimmedOpacity : activeOpacity;
        refs.frontendBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }
      if (refs.backendBoxMatRef.current) {
        const activeOpacity = isBackendActive ? 0.7 : 0.4;
        const finalOpacity = isInDetailSection && !isBackendActive ? dimmedOpacity : activeOpacity;
        refs.backendBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }
      if (refs.devopsBoxMatRef.current) {
        const activeOpacity = isDevopsActive ? 0.7 : 0.4;
        const finalOpacity = isInDetailSection && !isDevopsActive ? dimmedOpacity : activeOpacity;
        refs.devopsBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }

      if (refs.frontendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isFrontendActive ? 0.3 : 1;
        refs.frontendLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
      if (refs.backendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isBackendActive ? 0.3 : 1;
        refs.backendLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
      if (refs.devopsLabelRef.current) {
        const labelOpacity = isInDetailSection && !isDevopsActive ? 0.3 : 1;
        refs.devopsLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
    }

    // Time-based animation helper
    const animateElementByTime = (
      ref: React.RefObject<THREE.Group | null>,
      delaySeconds: number,
      durationSeconds: number = 0.6,
      fromZ: number = 4,
      fromX: number = 0
    ) => {
      if (!ref.current || enteredSection1Time.current === null) {
        if (ref.current) {
          ref.current.scale.setScalar(0);
        }
        return;
      }

      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const progress = Math.max(0, Math.min((elapsed - delaySeconds) / durationSeconds, 1));
      const eased = easeOutCubic(progress);

      ref.current.position.z = THREE.MathUtils.lerp(fromZ, 0, eased);
      if (fromX !== 0) {
        const originalX = ref.current.userData.originalX ?? ref.current.position.x;
        ref.current.userData.originalX = originalX;
        ref.current.position.x = THREE.MathUtils.lerp(originalX + fromX, originalX, eased);
      }
      ref.current.scale.setScalar(eased);
    };

    // Fly-in animation helper
    const flyInByTime = (
      ref: React.RefObject<THREE.Group | null>,
      delaySeconds: number,
      durationSeconds: number = 0.4,
      distance: number = 2
    ) => {
      if (!ref.current || enteredSection1Time.current === null) return;

      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const progress = Math.max(0, Math.min((elapsed - delaySeconds) / durationSeconds, 1));
      const eased = easeOutCubic(progress);

      ref.current.position.z = THREE.MathUtils.lerp(distance, 0.02, eased);
      ref.current.scale.setScalar(eased);
    };

    // ============ STAGGERED ENTRY ANIMATIONS ============
    const initialDelay = 0.3;

    // Frontend group (LEFT column)
    animateElementByTime(refs.frontendRef, initialDelay + 0.0, 0.8, 4, -3);
    animateElementByTime(refs.mobileRef, initialDelay + 0.12, 0.8, 4, -3);
    animateElementByTime(refs.backofficeRef, initialDelay + 0.24, 0.8, 4, -3);

    // Backend group (CENTER)
    animateElementByTime(refs.serverRef, initialDelay + 0.08, 0.9, 5);
    animateElementByTime(refs.databaseRef, initialDelay + 0.2, 0.8, 5);

    // DevOps group (RIGHT column)
    animateElementByTime(refs.cicdRef, initialDelay + 0.16, 0.8, 4, 3);
    animateElementByTime(refs.cloudRef, initialDelay + 0.28, 0.8, 4, 3);
    animateElementByTime(refs.archiRef, initialDelay + 0.4, 0.8, 4, 3);

    // Frontend UI blocks fly-in
    flyInByTime(refs.uiBlock1, initialDelay + 0.5, 0.5, 1.5);
    flyInByTime(refs.uiBlock2, initialDelay + 0.6, 0.5, 2.0);
    flyInByTime(refs.uiBlock3, initialDelay + 0.7, 0.5, 2.5);

    // Server timing
    if (currentSection >= 1 && serverVisibleTime.current === null) {
      serverVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      serverVisibleTime.current = null;
    }

    // Database timing
    if (currentSection >= 1 && databaseVisibleTime.current === null) {
      databaseVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      databaseVisibleTime.current = null;
    }

    // Server Blades Animation
    if (serverVisibleTime.current !== null) {
      serverLedIntensity.current = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.5;

      refs.bladeRefs.current.forEach((blade, i) => {
        if (!blade) return;

        const now = state.clock.elapsedTime;
        const startTime = serverVisibleTime.current!;
        const delay = i * 0.15;
        const duration = 0.6;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / duration, 1));
        const eased = easeOutCubic(timeProgress);

        const y = 0.55 - i * 0.155;
        const zStart = 2.5;
        const zEnd = 0.255;

        blade.position.set(0, y, THREE.MathUtils.lerp(zStart, zEnd, eased));
        blade.scale.setScalar(eased);

        blade.traverse((child) => {
          if ((child as any).isMesh && (child as any).material?.color) {
            const m = (child as any).material;
            if (m.name === "led_green") {
              m.color.setHSL(0.33, 1, 0.5 * serverLedIntensity.current);
            }
          }
        });
      });
    }

    // Database Rings Animation
    if (databaseVisibleTime.current !== null) {
      refs.databaseRingRefs.current.forEach((ring, i) => {
        if (!ring) return;
        const now = state.clock.elapsedTime;
        const startTime = databaseVisibleTime.current!;
        const delay = i * 0.2;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.5, 1));
        const eased = easeOutCubic(timeProgress);

        ring.scale.setScalar(eased);
        ring.position.z = THREE.MathUtils.lerp(2, 0, eased);

        if (timeProgress >= 1) {
          const pulse = 1 + Math.sin(now * 3 + i) * 0.5;
          if ((ring.material as THREE.MeshStandardMaterial).emissive) {
            (ring.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 * pulse;
          }
        }
      });
    }

    // Mobile Animation
    if (currentSection >= 1 && mobileVisibleTime.current === null) {
      mobileVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      mobileVisibleTime.current = null;
    }
    if (mobileVisibleTime.current !== null) {
      refs.chatBubbleRefs.current.forEach((bubble, i) => {
        if (!bubble) return;
        const now = state.clock.elapsedTime;
        const startTime = mobileVisibleTime.current!;
        const delay = i * 0.15;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.5, 1));
        const eased = easeOutCubic(timeProgress);
        bubble.scale.setScalar(eased);
        bubble.position.z = THREE.MathUtils.lerp(2, 0, eased);
      });
    }

    // Backoffice Animation
    if (currentSection >= 1 && backofficeVisibleTime.current === null) {
      backofficeVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      backofficeVisibleTime.current = null;
    }
    if (backofficeVisibleTime.current !== null) {
      refs.chartRefs.current.forEach((chart, i) => {
        if (!chart) return;
        const now = state.clock.elapsedTime;
        const startTime = backofficeVisibleTime.current!;
        const delay = i * 0.15;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.6, 1));
        const eased = easeOutCubic(timeProgress);
        chart.scale.setScalar(eased);
        chart.position.z = THREE.MathUtils.lerp(2, 0, eased);
      });
    }

    // CI/CD Animation
    if (currentSection >= 1 && cicdVisibleTime.current === null) {
      cicdVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      cicdVisibleTime.current = null;
    }
    if (cicdVisibleTime.current !== null) {
      refs.pipelineNodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const now = state.clock.elapsedTime;
        const startTime = cicdVisibleTime.current!;
        const delay = i * 0.2;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.4, 1));
        const eased = easeOutCubic(timeProgress);
        node.scale.setScalar(THREE.MathUtils.lerp(0, 1, eased));
        node.position.z = THREE.MathUtils.lerp(2, 0, eased);
      });
    }

    // Cloud Animation
    if (currentSection >= 1 && cloudVisibleTime.current === null) {
      cloudVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      cloudVisibleTime.current = null;
    }
    if (cloudVisibleTime.current !== null) {
      refs.cloudNodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const now = state.clock.elapsedTime;
        const startTime = cloudVisibleTime.current!;
        const delay = i * 0.1;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.6, 1));
        const eased = easeOutCubic(timeProgress);

        const zStart = 2;
        const zEnd = 0;
        const currentZ = THREE.MathUtils.lerp(zStart, zEnd, eased);
        const float = Math.sin(now * 2 + i) * 0.05;
        const baseX = Math.sin(i * 2) * 0.5;
        const baseY = Math.cos(i * 2) * 0.4;

        node.position.set(baseX, baseY + float, currentZ);
        node.scale.setScalar(0.5 * eased);
      });
    }

    // Architecture Animation
    if (currentSection >= 1 && archiVisibleTime.current === null) {
      archiVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      archiVisibleTime.current = null;
    }
    if (archiVisibleTime.current !== null) {
      refs.checklistRefs.current.forEach((item, i) => {
        if (!item) return;
        const now = state.clock.elapsedTime;
        const startTime = archiVisibleTime.current!;
        const delay = i * 0.2;
        const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.4, 1));
        const eased = easeOutCubic(timeProgress);
        item.scale.setScalar(eased);
        item.position.z = THREE.MathUtils.lerp(2, 0.03, eased);
      });
    }

    // Dezoom layout shift
    if (offset > DEZOOM_START) {
      const dezoomProgress = Math.min((offset - DEZOOM_START) / (DEZOOM_END - DEZOOM_START), 1);
      const easedDezoom = easeOutCubic(dezoomProgress);

      if (refs.skillsContainerRef.current) {
        refs.skillsContainerRef.current.position.x = THREE.MathUtils.lerp(
          BASE_X_OFFSET,
          BASE_X_OFFSET + 3,
          easedDezoom
        );
      }
    } else {
      if (refs.skillsContainerRef.current) {
        refs.skillsContainerRef.current.position.x = BASE_X_OFFSET;
      }
    }

    // Element dimming in detail view
    const isDetailView =
      (currentSection >= 3 && currentSection <= 5) ||
      (currentSection >= 7 && currentSection <= 8) ||
      (currentSection >= 10 && currentSection <= 12);

    const skillRefs = [
      { section: SECTION_MAP.FRONTEND, ref: refs.frontendRef },
      { section: SECTION_MAP.MOBILE, ref: refs.mobileRef },
      { section: SECTION_MAP.BACKOFFICE, ref: refs.backofficeRef },
      { section: SECTION_MAP.SERVER, ref: refs.serverRef },
      { section: SECTION_MAP.DATABASE, ref: refs.databaseRef },
      { section: SECTION_MAP.CICD, ref: refs.cicdRef },
      { section: SECTION_MAP.CLOUD, ref: refs.cloudRef },
      { section: SECTION_MAP.ARCHITECTURE, ref: refs.archiRef },
    ];

    skillRefs.forEach(({ section, ref }) => {
      if (!ref.current) return;

      const isSelected = currentSection === section;
      const targetOpacity = isDetailView ? (isSelected ? 1 : 0.1) : 1;

      if (ref.current.userData._smoothOp === undefined) {
        ref.current.userData._smoothOp = 1;
      }
      ref.current.userData._smoothOp = THREE.MathUtils.lerp(
        ref.current.userData._smoothOp,
        targetOpacity,
        0.1
      );

      const finalOp = ref.current.userData._smoothOp;

      ref.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            const m = mat as THREE.MeshStandardMaterial;
            if (m) {
              if ((m as any).__baseOpacity === undefined) {
                (m as any).__baseOpacity = m.opacity !== undefined ? m.opacity : 1;
                (m as any).__wasTransparent = m.transparent;
              }
              m.opacity = (m as any).__baseOpacity * finalOp;
              m.transparent = true;
              m.needsUpdate = true;
            }
          });
        }
      });
    });
  });

  return { scroll };
}
