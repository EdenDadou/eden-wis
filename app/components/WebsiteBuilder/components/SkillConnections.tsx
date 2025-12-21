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
  T_FRONT,
  T_MOBILE,
  T_BACK,
  T_SERVER,
  T_DB,
  T_CICD,
  T_CLOUD,
  T_ARCHI,
} from "../constants";

interface SkillConnectionsProps {
  offset: number;
  showElements: boolean;
}

export function SkillConnections({ offset, showElements }: SkillConnectionsProps) {
  const showParticles = offset > 0.94;

  const getLinkOpacity = (threshold: number) => {
    return Math.max(0, Math.min((offset - threshold) / 0.05, 1));
  };

  if (!showElements) return null;

  return (
    <>
      {/* ===== INTRA-GROUP VERTICAL CONNECTIONS ===== */}

      {/* FRONTEND GROUP (vertical chain) */}
      <ParticleStream
        start={P_FRONT}
        end={P_MOBILE}
        startColor={C_FRONT}
        endColor={C_MOBILE}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_FRONT, T_MOBILE))}
      />
      <ParticleStream
        start={P_MOBILE}
        end={P_BACK}
        startColor={C_MOBILE}
        endColor={C_BACK}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_MOBILE, T_BACK))}
      />

      {/* BACKEND GROUP (vertical) */}
      <ParticleStream
        start={P_SERVER}
        end={P_DB}
        startColor={C_SERVER}
        endColor={C_DB}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_SERVER, T_DB))}
      />

      {/* DEVOPS GROUP (vertical chain) */}
      <ParticleStream
        start={P_CICD}
        end={P_CLOUD}
        startColor={C_CICD}
        endColor={C_CLOUD}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_CICD, T_CLOUD))}
      />
      <ParticleStream
        start={P_CLOUD}
        end={P_ARCHI}
        startColor={C_CLOUD}
        endColor={C_ARCHI}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_CLOUD, T_ARCHI))}
      />

      {/* ===== CROSS-GROUP HORIZONTAL CONNECTIONS ===== */}

      {/* TOP ROW: Site Web <-> Server <-> CI/CD */}
      <ParticleStream
        start={P_FRONT}
        end={P_SERVER}
        startColor={C_FRONT}
        endColor={C_SERVER}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_FRONT, T_SERVER))}
      />
      <ParticleStream
        start={P_SERVER}
        end={P_CICD}
        startColor={C_SERVER}
        endColor={C_CICD}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_SERVER, T_CICD))}
      />

      {/* MIDDLE ROW: Mobile <-> Database <-> Cloud */}
      <ParticleStream
        start={P_MOBILE}
        end={P_DB}
        startColor={C_MOBILE}
        endColor={C_DB}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_MOBILE, T_DB))}
      />
      <ParticleStream
        start={P_DB}
        end={P_CLOUD}
        startColor={C_DB}
        endColor={C_CLOUD}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_DB, T_CLOUD))}
      />

      {/* BOTTOM ROW: Backoffice <-> Architecture */}
      <ParticleStream
        start={P_BACK}
        end={P_ARCHI}
        startColor={C_BACK}
        endColor={C_ARCHI}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_BACK, T_ARCHI))}
      />

      {/* ===== KEY DIAGONAL/CROSS CONNECTIONS ===== */}

      {/* Backoffice <-> Server */}
      <ParticleStream
        start={P_BACK}
        end={P_SERVER}
        startColor={C_BACK}
        endColor={C_SERVER}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_BACK, T_SERVER))}
      />
      {/* Backoffice <-> Database */}
      <ParticleStream
        start={P_BACK}
        end={P_DB}
        startColor={C_BACK}
        endColor={C_DB}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_BACK, T_DB))}
      />
      {/* Server <-> Cloud */}
      <ParticleStream
        start={P_SERVER}
        end={P_CLOUD}
        startColor={C_SERVER}
        endColor={C_CLOUD}
        showParticles={showParticles}
        opacity={getLinkOpacity(Math.max(T_SERVER, T_CLOUD))}
      />
    </>
  );
}
