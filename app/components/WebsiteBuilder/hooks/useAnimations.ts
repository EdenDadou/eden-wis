import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useFadeOpacity } from "../../scene3d/world";
import {
  DEZOOM_START,
  DEZOOM_END,
  BASE_X_OFFSET,
  SECTION_MAP,
  SECTION_BOUNDARIES,
  POS_FRONTEND,
  POS_MOBILE,
  POS_BACKOFFICE,
  POS_SERVER,
  POS_DATABASE,
  POS_CICD,
  POS_CLOUD,
  POS_ARCHI,
} from "../constants";

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
  const fadeOpacity = useFadeOpacity();

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

  // Particle and link animation state
  const [showParticles, setShowParticles] = useState(false);
  const [linkDrawProgress, setLinkDrawProgress] = useState<number[]>([]);
  const particlesTriggered = useRef(false);
  const linksTriggered = useRef(false);
  const linksVisible = useRef(false); // Track if links should be visible
  const linkAnimationStartTimes = useRef<number[]>([]);
  const shuffledLinkOrder = useRef<number[]>([]);
  const linkFadeOutStartTime = useRef<number | null>(null); // Track fade out animation
  const linkEntryTime = useRef<number | null>(null); // Track when we entered skill section
  const totalLinks = 11; // Total number of links in SkillConnections
  const linkDrawDuration = 0.4; // Duration to draw each link in seconds
  const linkStaggerDelay = 0.15; // Delay between starting each link
  const linkFadeOutDuration = 0.3; // Duration to fade out all links
  const linkAppearDelay = 1.5; // Delay before links appear after entering skill section

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
      // Reset particle and link animations
      setShowParticles(false);
      setLinkDrawProgress([]);
      particlesTriggered.current = false;
      linksTriggered.current = false;
      linksVisible.current = false;
      linkAnimationStartTimes.current = [];
      shuffledLinkOrder.current = [];
      linkFadeOutStartTime.current = null;
      linkEntryTime.current = null;
    }

    // Trigger particles after 1.5s delay (only in section >= 1)
    if (enteredSection1Time.current !== null && !particlesTriggered.current) {
      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      if (elapsed >= 1.5) {
        setShowParticles(true);
        particlesTriggered.current = true;
      }
    }

    // Links visibility logic: show in skill overview (1) and skill detail sections (2-9)
    const { DEVOPS_END: SKILLS_END } = SECTION_BOUNDARIES;
    const isInSkillSection = currentSection >= 1 && currentSection <= SKILLS_END;

    // Track when we enter skill section
    if (isInSkillSection && linkEntryTime.current === null && !linksVisible.current) {
      linkEntryTime.current = state.clock.elapsedTime;
      linkFadeOutStartTime.current = null;
    }

    // Reset entry time when leaving skill section
    if (!isInSkillSection && linkEntryTime.current !== null && !linksVisible.current) {
      linkEntryTime.current = null;
    }

    // Start link animation after delay
    if (isInSkillSection && linkEntryTime.current !== null && !linksVisible.current) {
      const elapsed = state.clock.elapsedTime - linkEntryTime.current;
      if (elapsed >= linkAppearDelay) {
        linksVisible.current = true;
        linksTriggered.current = true;

        // Create shuffled array of link indices
        const indices = Array.from({ length: totalLinks }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffledLinkOrder.current = indices;

        // Set start times for each link based on shuffled order
        const startTimes = new Array(totalLinks).fill(0);
        indices.forEach((linkIndex, order) => {
          startTimes[linkIndex] = state.clock.elapsedTime + order * linkStaggerDelay;
        });
        linkAnimationStartTimes.current = startTimes;
        setLinkDrawProgress(new Array(totalLinks).fill(0));
      }
    }

    // Start fade out when leaving skill section
    if (!isInSkillSection && linksVisible.current && linkFadeOutStartTime.current === null) {
      linkFadeOutStartTime.current = state.clock.elapsedTime;
    }

    // Animate link draw progress (fade in)
    if (linksTriggered.current && linkAnimationStartTimes.current.length > 0 && isInSkillSection) {
      const now = state.clock.elapsedTime;
      const newProgress = linkAnimationStartTimes.current.map((startTime) => {
        if (now < startTime) return 0;
        const elapsed = now - startTime;
        return Math.min(elapsed / linkDrawDuration, 1);
      });
      setLinkDrawProgress(newProgress);
    }

    // Animate link fade out
    if (linkFadeOutStartTime.current !== null && !isInSkillSection) {
      const now = state.clock.elapsedTime;
      const fadeElapsed = now - linkFadeOutStartTime.current;
      const fadeProgress = Math.min(fadeElapsed / linkFadeOutDuration, 1);

      // Fade out all links simultaneously
      const newProgress = linkDrawProgress.map((p) => Math.max(0, p * (1 - fadeProgress)));
      setLinkDrawProgress(newProgress);

      // Reset when fade out is complete
      if (fadeProgress >= 1) {
        linksVisible.current = false;
        linksTriggered.current = false;
        linkAnimationStartTimes.current = [];
        shuffledLinkOrder.current = [];
        linkFadeOutStartTime.current = null;
        setLinkDrawProgress([]);
      }
    }

    // ============ CATEGORY BOX FADE-IN ============
    if (enteredSection1Time.current !== null) {
      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const fadeDelay = 0.3;
      const fadeDuration = 0.6;
      const fadeProgress = Math.max(0, Math.min((elapsed - fadeDelay) / fadeDuration, 1));
      categoryBoxOpacity.current = easeOutCubic(fadeProgress);

      const baseOpacity = categoryBoxOpacity.current;
      const { FRONTEND_START, FRONTEND_END, BACKEND_START, BACKEND_END, DEVOPS_START, DEVOPS_END } = SECTION_BOUNDARIES;

      const isFrontendActive = currentSection >= FRONTEND_START && currentSection <= FRONTEND_END;
      const isBackendActive = currentSection >= BACKEND_START && currentSection <= BACKEND_END;
      const isDevopsActive = currentSection >= DEVOPS_START && currentSection <= DEVOPS_END;

      // All skill sections (2-9) are now detail views
      const isInDetailSection = currentSection >= FRONTEND_START && currentSection <= DEVOPS_END;

      const dimmedOpacity = 0.08;

      // Apply section fade opacity for orbital navigation
      const sectionFade = fadeOpacity.current;

      if (refs.frontendBoxMatRef.current) {
        const mat = refs.frontendBoxMatRef.current as any;
        mat._externallyManaged = true; // Prevent FadingSection from modifying
        // Keep active category at 0.8, dim inactive ones
        const finalOpacity = isInDetailSection && !isFrontendActive ? dimmedOpacity : 0.8;
        mat.opacity = finalOpacity * baseOpacity * sectionFade;
      }
      if (refs.backendBoxMatRef.current) {
        const mat = refs.backendBoxMatRef.current as any;
        mat._externallyManaged = true;
        const finalOpacity = isInDetailSection && !isBackendActive ? dimmedOpacity : 0.8;
        mat.opacity = finalOpacity * baseOpacity * sectionFade;
      }
      if (refs.devopsBoxMatRef.current) {
        const mat = refs.devopsBoxMatRef.current as any;
        mat._externallyManaged = true;
        const finalOpacity = isInDetailSection && !isDevopsActive ? dimmedOpacity : 0.8;
        mat.opacity = finalOpacity * baseOpacity * sectionFade;
      }

      if (refs.frontendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isFrontendActive ? 0.3 : 1;
        const finalLabelOp = labelOpacity * baseOpacity * sectionFade;
        refs.frontendLabelRef.current.fillOpacity = finalLabelOp;
        refs.frontendLabelRef.current.outlineOpacity = finalLabelOp;
      }
      if (refs.backendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isBackendActive ? 0.3 : 1;
        const finalLabelOp = labelOpacity * baseOpacity * sectionFade;
        refs.backendLabelRef.current.fillOpacity = finalLabelOp;
        refs.backendLabelRef.current.outlineOpacity = finalLabelOp;
      }
      if (refs.devopsLabelRef.current) {
        const labelOpacity = isInDetailSection && !isDevopsActive ? 0.3 : 1;
        const finalLabelOp = labelOpacity * baseOpacity * sectionFade;
        refs.devopsLabelRef.current.fillOpacity = finalLabelOp;
        refs.devopsLabelRef.current.outlineOpacity = finalLabelOp;
      }
    }

    // Time-based animation helper
    const animateElementByTime = (
      ref: React.RefObject<THREE.Group | null>,
      delaySeconds: number,
      durationSeconds: number = 0.6,
      fromZ: number = 4,
      fromX: number = 0,
      targetX?: number // Use constant position instead of reading from ref
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

      // Only animate X position during the animation (progress < 1)
      // Once animation is complete, don't touch X - let JSX position take over
      if (fromX !== 0 && targetX !== undefined && progress < 1) {
        ref.current.position.x = THREE.MathUtils.lerp(targetX + fromX, targetX, eased);
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

    // Frontend group (LEFT column) - elements fly in from the front
    animateElementByTime(refs.frontendRef, initialDelay + 0.0, 0.8, 4);
    animateElementByTime(refs.mobileRef, initialDelay + 0.12, 0.8, 4);
    animateElementByTime(refs.backofficeRef, initialDelay + 0.24, 0.8, 4);

    // Backend group (CENTER) - elements fly in from the front
    animateElementByTime(refs.serverRef, initialDelay + 0.08, 0.9, 5);
    animateElementByTime(refs.databaseRef, initialDelay + 0.2, 0.8, 5);

    // DevOps group (RIGHT column) - elements fly in from the front
    animateElementByTime(refs.cicdRef, initialDelay + 0.16, 0.8, 4);
    animateElementByTime(refs.cloudRef, initialDelay + 0.28, 0.8, 4);
    animateElementByTime(refs.archiRef, initialDelay + 0.4, 0.8, 4);

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

    // Element dimming in detail view (all skill sections 2-9 are now detail views)
    const { FRONTEND_START: FS, DEVOPS_END: DE } = SECTION_BOUNDARIES;
    const isDetailView = currentSection >= FS && currentSection <= DE;

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

    // Get section fade for orbital navigation
    const sectionFade = fadeOpacity.current;

    skillRefs.forEach(({ section, ref }) => {
      if (!ref.current) return;

      const isSelected = currentSection === section;
      const targetOpacity = isDetailView ? (isSelected ? 1 : 0.1) : 1;

      if (ref.current.userData._smoothOp === undefined) {
        ref.current.userData._smoothOp = 1;
      }
      // When leaving detail view, snap to full opacity immediately
      // Only use smooth transition when in detail view
      if (!isDetailView) {
        ref.current.userData._smoothOp = 1;
      } else {
        // Use faster lerp when returning to full opacity (going back)
        const lerpSpeed = targetOpacity > ref.current.userData._smoothOp ? 0.25 : 0.1;
        ref.current.userData._smoothOp = THREE.MathUtils.lerp(
          ref.current.userData._smoothOp,
          targetOpacity,
          lerpSpeed
        );
      }

      const finalOp = ref.current.userData._smoothOp;

      ref.current.traverse((child: any) => {
        // Handle troika Text components
        if (child.text !== undefined && child.material) {
          if (child._baseOutlineOpacity === undefined) {
            child._baseOutlineOpacity = child.outlineOpacity ?? 1;
            child._baseFillOpacity = child.fillOpacity ?? 1;
          }
          child.outlineOpacity = child._baseOutlineOpacity * finalOp * sectionFade;
          if (child._baseFillOpacity > 0) {
            child.fillOpacity = child._baseFillOpacity * finalOp * sectionFade;
          }
          if (child.sync) child.sync();
        }

        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            const m = mat as THREE.MeshStandardMaterial;
            if (m) {
              // Mark as externally managed so FadingSection doesn't double-apply
              (m as any)._externallyManaged = true;

              // Capture base opacity on first encounter only
              if ((m as any).__baseOpacity === undefined) {
                (m as any).__baseOpacity = m.opacity !== undefined ? m.opacity : 1;
                (m as any).__wasTransparent = m.transparent;
              }

              // Apply both detail dimming AND section fade for orbital navigation
              const baseOp = (m as any).__baseOpacity;
              m.opacity = baseOp * finalOp * sectionFade;
              m.transparent = true;
              m.needsUpdate = true;
            }
          });
        }
      });
    });
  }, -2); // Priority -2 to run BEFORE FadingSection (-1) so _externallyManaged is set first

  return { scroll, showParticles, linkDrawProgress };
}
