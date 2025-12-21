import { useRef } from "react";
import * as THREE from "three";

import { useAnimations } from "./hooks/useAnimations";
import { CategoryBox } from "./components/CategoryBox";
import { SkillConnections } from "./components/SkillConnections";
import {
  CloudSkill,
  DatabaseSkill,
  ServerSkill,
  CICDSkill,
  ArchitectureSkill,
  FrontendSkill,
  MobileSkill,
  BackofficeSkill,
} from "./components/skills";
import {
  FACE_CAMERA_ROTATION,
  C_HIGHLIGHT,
  SECTION_MAP,
  SECTION_BOUNDARIES,
} from "./constants";
import type { WebsiteBuilderProps } from "./types";

export default function WebsiteBuilder({
  currentSection = 0,
  onSkillClick,
}: WebsiteBuilderProps) {
  // Main refs
  const sceneRef = useRef<THREE.Group>(null);
  const skillsContainerRef = useRef<THREE.Group>(null);

  // Skill element refs
  const serverRef = useRef<THREE.Group>(null);
  const databaseRef = useRef<THREE.Group>(null);
  const backofficeRef = useRef<THREE.Group>(null);
  const archiRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Group>(null);
  const mobileRef = useRef<THREE.Group>(null);
  const frontendRef = useRef<THREE.Group>(null);
  const cicdRef = useRef<THREE.Group>(null);

  // Category group refs
  const frontendGroupRef = useRef<THREE.Group>(null);
  const backendGroupRef = useRef<THREE.Group>(null);
  const devopsGroupRef = useRef<THREE.Group>(null);

  // Category material refs
  const frontendBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backendBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const devopsBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Category label refs
  const frontendLabelRef = useRef<any>(null);
  const backendLabelRef = useRef<any>(null);
  const devopsLabelRef = useRef<any>(null);

  // Sub-element refs
  const bladeRefs = useRef<(THREE.Group | null)[]>([]);
  const databaseRingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const chatBubbleRefs = useRef<(THREE.Group | null)[]>([]);
  const chartRefs = useRef<(THREE.Line | THREE.Mesh | THREE.Group | null)[]>([]);
  const pipelineNodeRefs = useRef<(THREE.Group | null)[]>([]);
  const cloudNodeRefs = useRef<(THREE.Mesh | THREE.Group | null)[]>([]);
  const checklistRefs = useRef<(THREE.Group | null)[]>([]);

  // Frontend UI block refs
  const uiBlock1 = useRef<THREE.Group>(null);
  const uiBlock2 = useRef<THREE.Group>(null);
  const uiBlock3 = useRef<THREE.Group>(null);

  // Initialize animations
  const { scroll, showParticles, linkDrawProgress } = useAnimations({
    currentSection,
    refs: {
      sceneRef,
      serverRef,
      databaseRef,
      backofficeRef,
      archiRef,
      cloudRef,
      mobileRef,
      frontendRef,
      cicdRef,
      frontendBoxMatRef,
      backendBoxMatRef,
      devopsBoxMatRef,
      frontendLabelRef,
      backendLabelRef,
      devopsLabelRef,
      skillsContainerRef,
      bladeRefs,
      databaseRingRefs,
      chatBubbleRefs,
      chartRefs,
      pipelineNodeRefs,
      cloudNodeRefs,
      checklistRefs,
      uiBlock1,
      uiBlock2,
      uiBlock3,
    },
  });

  const offset = scroll?.offset || 0;

  // Visibility
  const showElements = currentSection >= 1;
  const showCategoryBoxes = currentSection >= 1;

  // Active states using section boundaries
  const { FRONTEND_START, FRONTEND_END, BACKEND_START, BACKEND_END, DEVOPS_START, DEVOPS_END } = SECTION_BOUNDARIES;

  const isFrontendGroupActive = currentSection >= FRONTEND_START && currentSection <= FRONTEND_END;
  const isBackendGroupActive = currentSection >= BACKEND_START && currentSection <= BACKEND_END;
  const isDevopsGroupActive = currentSection >= DEVOPS_START && currentSection <= DEVOPS_END;

  // All skill detail sections (2-9) are detail views now (no more transition slides)
  const isInDetailSection = currentSection >= FRONTEND_START && currentSection <= DEVOPS_END;

  // Helper to determine label color
  const getElementLabelColor = (elementSection: number, baseColor: string) => {
    const isElementActive = currentSection === elementSection;
    if (!isInDetailSection) {
      return isElementActive ? C_HIGHLIGHT : baseColor;
    }
    return isElementActive ? C_HIGHLIGHT : "#444444";
  };

  return (
    <group ref={sceneRef}>
      <group
        ref={skillsContainerRef}
        position={[3, 0, 0]}
        rotation={[0, FACE_CAMERA_ROTATION, 0]}
      >
        {/* Category Boxes */}
        {showCategoryBoxes && (
          <>
            <CategoryBox
              ref={frontendGroupRef}
              type="frontend"
              isActive={isFrontendGroupActive}
              materialRef={frontendBoxMatRef}
              labelRef={frontendLabelRef}
            />
            <CategoryBox
              ref={backendGroupRef}
              type="backend"
              isActive={isBackendGroupActive}
              materialRef={backendBoxMatRef}
              labelRef={backendLabelRef}
            />
            <CategoryBox
              ref={devopsGroupRef}
              type="devops"
              isActive={isDevopsGroupActive}
              materialRef={devopsBoxMatRef}
              labelRef={devopsLabelRef}
            />
          </>
        )}

        {/* Skill Elements */}
        {showElements && (
          <>
            <CloudSkill
              ref={cloudRef}
              isActive={currentSection === SECTION_MAP.CLOUD}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.CLOUD, base)}
              cloudNodeRefs={cloudNodeRefs}
            />

            <DatabaseSkill
              ref={databaseRef}
              isActive={currentSection === SECTION_MAP.DATABASE}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.DATABASE, base)}
              databaseRingRefs={databaseRingRefs}
            />

            <CICDSkill
              ref={cicdRef}
              isActive={currentSection === SECTION_MAP.CICD}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.CICD, base)}
              pipelineNodeRefs={pipelineNodeRefs}
            />

            <ServerSkill
              ref={serverRef}
              isActive={currentSection === SECTION_MAP.SERVER}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.SERVER, base)}
              bladeRefs={bladeRefs}
            />

            <ArchitectureSkill
              ref={archiRef}
              isActive={currentSection === SECTION_MAP.ARCHITECTURE}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.ARCHITECTURE, base)}
              checklistRefs={checklistRefs}
            />

            <FrontendSkill
              ref={frontendRef}
              isActive={currentSection === SECTION_MAP.FRONTEND}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.FRONTEND, base)}
              uiBlock1={uiBlock1}
              uiBlock2={uiBlock2}
              uiBlock3={uiBlock3}
            />

            <MobileSkill
              ref={mobileRef}
              isActive={currentSection === SECTION_MAP.MOBILE}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.MOBILE, base)}
              chatBubbleRefs={chatBubbleRefs}
            />

            <BackofficeSkill
              ref={backofficeRef}
              isActive={currentSection === SECTION_MAP.BACKOFFICE}
              isInDetailSection={isInDetailSection}
              onSkillClick={onSkillClick}
              getLabelColor={(base) => getElementLabelColor(SECTION_MAP.BACKOFFICE, base)}
              chartRefs={chartRefs}
            />
          </>
        )}

        {/* Skill Connections */}
        <SkillConnections
          offset={offset}
          showElements={showElements}
          showParticles={showParticles}
          linkDrawProgress={linkDrawProgress}
        />
      </group>
    </group>
  );
}
