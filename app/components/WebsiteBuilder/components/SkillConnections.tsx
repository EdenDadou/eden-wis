import { useMemo } from "react";
import {
  GRID_X,
  GRID_Y,
  C_SERVER,
  C_DB,
  C_CICD,
  C_CLOUD,
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

  const baseOpacity = isInDetailSection ? 0.4 : 0.7;

  // Backend positions (shifted down by 1.5)
  const SERVER_Y = GRID_Y * 0.5 - 1.5;
  const DB_Y = -GRID_Y * 0.5 - 1.5;

  // Connection definitions with start/end colors for gradient
  const connections = useMemo(
    () => [
      // Server to Database (vertical)
      {
        start: [-0.15, SERVER_Y - 0.5, 0] as [number, number, number],
        end: [-0.15, DB_Y + 0.5, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_DB,
      },
      // Frontend to Server
      {
        start: [-GRID_X + 0.6, GRID_Y, 0] as [number, number, number],
        end: [-0.6, SERVER_Y + 0.2, 0] as [number, number, number],
        startColor: C_FRONT,
        endColor: C_SERVER,
      },
      // Mobile to Server
      {
        start: [-GRID_X + 0.6, 0, 0] as [number, number, number],
        end: [-0.6, SERVER_Y, 0] as [number, number, number],
        startColor: C_MOBILE,
        endColor: C_SERVER,
      },
      // Backoffice to Server
      {
        start: [-GRID_X + 0.6, -GRID_Y, 0] as [number, number, number],
        end: [-0.6, SERVER_Y - 0.2, 0] as [number, number, number],
        startColor: C_BACK,
        endColor: C_SERVER,
      },
      // Server to CI/CD
      {
        start: [0.4, SERVER_Y + 0.2, 0] as [number, number, number],
        end: [GRID_X - 0.9, GRID_Y, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_CICD,
      },
      // Server to Cloud
      {
        start: [0.4, SERVER_Y - 0.2, 0] as [number, number, number],
        end: [GRID_X - 0.9, 0, 0] as [number, number, number],
        startColor: C_SERVER,
        endColor: C_CLOUD,
      },
      // CI/CD to Cloud (vertical)
      {
        start: [GRID_X - 0.3, GRID_Y - 0.5, 0] as [number, number, number],
        end: [GRID_X - 0.3, 0.5, 0] as [number, number, number],
        startColor: C_CICD,
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
        return (
          <ParticleStream
            key={index}
            start={conn.start}
            end={conn.end}
            startColor={conn.startColor}
            endColor={conn.endColor}
            opacity={baseOpacity * progress}
            drawProgress={progress}
          />
        );
      })}
    </>
  );
}
