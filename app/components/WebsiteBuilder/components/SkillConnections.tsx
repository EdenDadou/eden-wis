import { useMemo } from "react";
import {
  GRID_X,
  GRID_Y,
  C_SERVER,
  C_DB,
  C_CICD,
  C_CLOUD,
  C_ARCHI,
  C_FRONT,
  C_MOBILE,
  C_BACK,
} from "../constants";
import { ParticleStream } from "./ParticleStream";

interface SkillConnectionsProps {
  showElements: boolean;
  showParticles?: boolean;
  linkDrawProgress?: number[];
  isInDetailSection: boolean;
}

export function SkillConnections({
  showElements,
  showParticles = false,
  linkDrawProgress = [],
  isInDetailSection,
}: SkillConnectionsProps) {
  if (!showElements) return null;

  // If linkDrawProgress is empty or all zeros, don't render anything yet
  const hasProgress = linkDrawProgress.length > 0 && linkDrawProgress.some(p => p > 0);
  if (!hasProgress) return null;

  const baseOpacity = isInDetailSection ? 0.1 : 0.7;

  // Element center X positions
  const BACKEND_X = -0.15;
  const DEVOPS_X = GRID_X - 0.3; // = 2.9

  // Label Y offset from element center
  const LABEL_Y = -1.15;       // Y for right side (Server right, DevOps)
  const LABEL_Y_LEFT = -1.15;  // Y for left column (Frontend, Mobile, Backoffice)

  // Direct X coordinates for connection points (tuned visually)
  // Frontend column labels
  const FRONT_RIGHT = -GRID_X + 1.0;    // Right edge of "APP WEB"
  const MOBILE_RIGHT = -GRID_X + 0.95;  // Right edge of "MOBILE"
  const BACK_RIGHT = -GRID_X + 1.1;     // Right edge of "BACKOFFICE"

  // Server label edges
  const SERVER_LEFT = BACKEND_X - 0.35;  // Left edge of "SERVEUR"
  const SERVER_RIGHT = BACKEND_X + 0.75; // Right edge of "SERVEUR"

  // Database label edge
  const DB_RIGHT = BACKEND_X + 0.8;     // Right edge of "DATABASE"

  // DevOps column labels
  const CICD_LEFT = DEVOPS_X - 0.15;    // Left edge of "CI/CD"
  const CLOUD_LEFT = DEVOPS_X - 0.2;    // Left edge of "CLOUD"

  // Connection definitions
  const connections = useMemo(
    () => [
      // Server to Database (vertical, from below Server label to above Database model) - RED
      {
        start: [BACKEND_X + 0.1, 0 + LABEL_Y - 0.35, 0] as [number, number, number],
        end: [BACKEND_X + 0.1, -GRID_Y + 0.45, 0] as [number, number, number],
        startColor: C_DB,
        endColor: C_DB,
      },
      // Frontend to Server - GREEN (shortened)
      {
        start: [FRONT_RIGHT, GRID_Y + LABEL_Y_LEFT, 0] as [number, number, number],
        end: [SERVER_LEFT, 0 + LABEL_Y_LEFT, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_SERVER,
        maxProgress: 0.75,
      },
      // Mobile to Server - GREEN (shortest - horizontal)
      {
        start: [MOBILE_RIGHT, 0 + LABEL_Y_LEFT, 0] as [number, number, number],
        end: [SERVER_LEFT, 0 + LABEL_Y_LEFT, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_SERVER,
        maxProgress: 0.7,
      },
      // Backoffice to Server - GREEN (shortened)
      {
        start: [BACK_RIGHT, -GRID_Y + LABEL_Y_LEFT + 0.4, 0] as [number, number, number],
        end: [SERVER_LEFT, 0 + LABEL_Y_LEFT, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_SERVER,
        maxProgress: 0.75,
      },
      // CI/CD to Cloud (vertical, from below CI/CD label to above Cloud label)
      {
        start: [DEVOPS_X + 0.2, GRID_Y + LABEL_Y - 0.2, 0] as [number, number, number],
        end: [DEVOPS_X + 0.2, 0 + LABEL_Y + 1.1, 0] as [number, number, number],
        startColor: C_CICD,
        endColor: C_CLOUD,
      },
      // Cloud to Architecture (vertical, from below Cloud label to above Architecture label)
      {
        start: [DEVOPS_X + 0.2, 0 + LABEL_Y - 0.2, 0] as [number, number, number],
        end: [DEVOPS_X + 0.2, -GRID_Y + LABEL_Y + 1.1, 0] as [number, number, number],
        startColor: C_CLOUD,
        endColor: C_CLOUD,
      },
    ],
    []
  );

  return (
    <>
      {connections.map((conn, index) => {
        const progress = linkDrawProgress[index] ?? 0;
        if (progress <= 0) return null;
        const maxProg = (conn as any).maxProgress ?? 1;
        const opacityMult = (conn as any).opacityMultiplier ?? 1;
        const effectiveProgress = Math.min(progress, maxProg);
        return (
          <ParticleStream
            key={index}
            start={conn.start}
            end={conn.end}
            startColor={conn.startColor}
            endColor={conn.endColor}
            opacity={baseOpacity * progress * opacityMult}
            drawProgress={effectiveProgress}
          />
        );
      })}
    </>
  );
}
