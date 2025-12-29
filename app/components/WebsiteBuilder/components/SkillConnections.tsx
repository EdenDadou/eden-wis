import { ParticleStream } from "./ParticleStream";
import {
  P_FRONT,
  P_MOBILE,
  P_BACK,
  P_SERVER_LEFT,
  P_SERVER_RIGHT,
  P_SERVER_BOTTOM,
  P_DB_LEFT,
  P_DB_RIGHT,
  P_DB_TOP,
  P_CICD,
  P_CLOUD,
  P_ARCHI,
  C_FRONT,
  C_MOBILE,
  C_BACK,
  C_SERVER,
  C_DB,
  C_CICD,
  C_CLOUD,
  C_ARCHI,
} from "../constants";

interface SkillConnectionsProps {
  showElements: boolean;
  showParticles: boolean;
  linkDrawProgress: number[];
  isInDetailSection: boolean;
}

export function SkillConnections({
  showElements,
  showParticles,
  linkDrawProgress,
  isInDetailSection,
}: SkillConnectionsProps) {
  if (!showElements) return null;

  // Get draw progress for a link (0 if not started)
  const getDrawProgress = (index: number) => linkDrawProgress[index] || 0;

  // Define all links with their properties
  // Frontend: points on right -> Server: points on left
  // Server: points on right -> DevOps: points on left
  // Server <-> Database: top/bottom connection
  const links = [
    // BACKEND GROUP (vertical) - Server bottom to Database top (all red)
    { start: P_SERVER_BOTTOM, end: P_DB_TOP, startColor: C_DB, endColor: C_DB },
    // DEVOPS GROUP (vertical chain) - left side points
    { start: P_CICD, end: P_CLOUD, startColor: C_CICD, endColor: C_CLOUD },
    // FRONTEND -> SERVER (all green - server color)
    { start: P_FRONT, end: P_SERVER_LEFT, startColor: C_SERVER, endColor: C_SERVER },
    { start: P_MOBILE, end: P_SERVER_LEFT, startColor: C_SERVER, endColor: C_SERVER },
    // BACKOFFICE -> SERVER (all green - server color)
    { start: P_BACK, end: P_SERVER_LEFT, startColor: C_SERVER, endColor: C_SERVER },
    // SERVER -> DEVOPS (right to left)
    { start: P_SERVER_RIGHT, end: P_CICD, startColor: C_SERVER, endColor: C_CICD },
    { start: P_SERVER_RIGHT, end: P_CLOUD, startColor: C_SERVER, endColor: C_CLOUD },
  ];

  return (
    <>
      {links.map((link, index) => {
        const progress = getDrawProgress(index);
        if (progress === 0) return null; // Don't render if not started
        return (
          <ParticleStream
            key={index}
            start={link.start}
            end={link.end}
            startColor={link.startColor}
            endColor={link.endColor}
            showParticles={showParticles && progress === 1}
            opacity={isInDetailSection ? 0.15 : 1}
            drawProgress={progress}
          />
        );
      })}
    </>
  );
}
