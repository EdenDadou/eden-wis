import { ParticleStream } from "./ParticleStream";
import {
  P_FRONT,
  P_MOBILE,
  P_BACK,
  P_SERVER,
  P_DB,
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
  offset: number;
  showElements: boolean;
  showParticles: boolean;
  linkDrawProgress: number[];
}

export function SkillConnections({
  offset,
  showElements,
  showParticles,
  linkDrawProgress,
}: SkillConnectionsProps) {
  if (!showElements) return null;

  // Get draw progress for a link (0 if not started)
  const getDrawProgress = (index: number) => linkDrawProgress[index] || 0;

  // Define all links with their properties
  const links = [
    // FRONTEND GROUP (vertical chain)
    { start: P_FRONT, end: P_MOBILE, startColor: C_FRONT, endColor: C_MOBILE },
    { start: P_MOBILE, end: P_BACK, startColor: C_MOBILE, endColor: C_BACK },
    // BACKEND GROUP (vertical)
    { start: P_SERVER, end: P_DB, startColor: C_DB, endColor: C_DB },
    // DEVOPS GROUP (vertical chain)
    { start: P_CICD, end: P_CLOUD, startColor: C_CICD, endColor: C_CLOUD },
    { start: P_CLOUD, end: P_ARCHI, startColor: C_CLOUD, endColor: C_ARCHI },
    // CROSS-GROUP HORIZONTAL
    { start: P_FRONT, end: P_SERVER, startColor: C_FRONT, endColor: C_SERVER },
    { start: P_SERVER, end: P_CICD, startColor: C_SERVER, endColor: C_CICD },
    { start: P_MOBILE, end: P_SERVER, startColor: C_MOBILE, endColor: C_SERVER },
    { start: P_DB, end: P_CLOUD, startColor: C_DB, endColor: C_DB },
    // KEY DIAGONAL/CROSS
    { start: P_BACK, end: P_SERVER, startColor: C_BACK, endColor: C_SERVER },
    { start: P_SERVER, end: P_CLOUD, startColor: C_SERVER, endColor: C_CLOUD },
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
            opacity={1}
            drawProgress={progress}
          />
        );
      })}
    </>
  );
}
