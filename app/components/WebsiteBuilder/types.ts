import * as THREE from "three";

export interface WebsiteBuilderProps {
  currentSection?: number;
  onSkillClick?: (skillSection: number) => void;
}

export interface SkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
}

export interface ParticleStreamProps {
  start: number[];
  end: number[];
  startColor?: string;
  endColor?: string;
  speed?: number;
  count?: number;
  showParticles?: boolean;
  opacity?: number;
  drawProgress?: number; // 0-1, how much of the line is drawn
}

export interface CategoryBoxProps {
  type: "frontend" | "backend" | "devops";
  isActive: boolean;
  baseOpacity: number;
  gridX: number;
  gridY: number;
}

export interface AnimationRefs {
  sceneRef: React.RefObject<THREE.Group | null>;
  serverRef: React.RefObject<THREE.Group | null>;
  databaseRef: React.RefObject<THREE.Group | null>;
  backofficeRef: React.RefObject<THREE.Group | null>;
  archiRef: React.RefObject<THREE.Group | null>;
  cloudRef: React.RefObject<THREE.Group | null>;
  mobileRef: React.RefObject<THREE.Group | null>;
  frontendRef: React.RefObject<THREE.Group | null>;
  cicdRef: React.RefObject<THREE.Group | null>;
  frontendGroupRef: React.RefObject<THREE.Group | null>;
  backendGroupRef: React.RefObject<THREE.Group | null>;
  devopsGroupRef: React.RefObject<THREE.Group | null>;
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
}
