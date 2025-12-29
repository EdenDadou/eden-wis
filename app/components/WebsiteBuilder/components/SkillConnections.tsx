import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import {
  GRID_X,
  GRID_Y,
  C_SERVER,
  C_DB,
  C_CICD,
  C_CLOUD,
} from "../constants";

interface SkillConnectionsProps {
  showElements: boolean;
  showParticles?: boolean;
  linkDrawProgress?: number[];
  isInDetailSection: boolean;
}

// Animated curved line component with draw progress
function CurvedConnection({
  start,
  end,
  color,
  opacity = 0.25,
  drawProgress = 1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  opacity?: number;
  drawProgress?: number;
}) {
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);

    // Calculate control point for quadratic bezier curve
    const midX = (startVec.x + endVec.x) / 2;
    const midY = (startVec.y + endVec.y) / 2;

    // Offset control point perpendicular to line for curve effect
    const dx = endVec.x - startVec.x;
    const dy = endVec.y - startVec.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const curveAmount = len * 0.15; // Subtle curve

    // Control point offset perpendicular to line
    const controlX = midX - (dy / len) * curveAmount;
    const controlY = midY + (dx / len) * curveAmount;

    // Generate curve points
    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      new THREE.Vector3(controlX, controlY, -0.3),
      endVec
    );

    return curve.getPoints(30);
  }, [start, end]);

  // Calculate how many points to show based on drawProgress
  const visiblePoints = useMemo(() => {
    if (drawProgress >= 1) return points;
    if (drawProgress <= 0) return [];
    const numPoints = Math.max(2, Math.ceil(points.length * drawProgress));
    return points.slice(0, numPoints);
  }, [points, drawProgress]);

  if (visiblePoints.length < 2) return null;

  return (
    <Line
      points={visiblePoints}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={opacity * drawProgress}
    />
  );
}

export function SkillConnections({
  showElements,
  linkDrawProgress = [],
  isInDetailSection,
}: SkillConnectionsProps) {
  if (!showElements) return null;

  // If linkDrawProgress is empty or all zeros, don't render anything yet
  const hasProgress = linkDrawProgress.length > 0 && linkDrawProgress.some(p => p > 0);
  if (!hasProgress) return null;

  const baseOpacity = isInDetailSection ? 0.25 : 0.6;

  // Backend positions (shifted down by 1.5)
  const SERVER_Y = GRID_Y * 0.5 - 1.5;
  const DB_Y = -GRID_Y * 0.5 - 1.5;

  // Connection definitions - minimal, elegant
  const connections = useMemo(
    () => [
      // Server to Database (vertical, red)
      {
        start: [0, SERVER_Y - 0.5, -0.3] as [number, number, number],
        end: [0, DB_Y + 0.5, -0.3] as [number, number, number],
        color: C_DB,
      },
      // Frontend column to Server
      {
        start: [-GRID_X + 0.6, GRID_Y - 0.3, -0.3] as [number, number, number],
        end: [-0.6, SERVER_Y + 0.2, -0.3] as [number, number, number],
        color: C_SERVER,
      },
      {
        start: [-GRID_X + 0.6, -0.3, -0.3] as [number, number, number],
        end: [-0.6, SERVER_Y, -0.3] as [number, number, number],
        color: C_SERVER,
      },
      {
        start: [-GRID_X + 0.6, -GRID_Y + 0.3, -0.3] as [number, number, number],
        end: [-0.6, SERVER_Y - 0.2, -0.3] as [number, number, number],
        color: C_SERVER,
      },
      // Server to DevOps column
      {
        start: [0.6, SERVER_Y + 0.2, -0.3] as [number, number, number],
        end: [GRID_X - 0.6, GRID_Y - 0.3, -0.3] as [number, number, number],
        color: C_CICD,
      },
      {
        start: [0.6, SERVER_Y - 0.2, -0.3] as [number, number, number],
        end: [GRID_X - 0.6, 0.3, -0.3] as [number, number, number],
        color: C_CLOUD,
      },
      // CI/CD to Cloud (vertical)
      {
        start: [GRID_X, GRID_Y - 0.5, -0.3] as [number, number, number],
        end: [GRID_X, 0.5, -0.3] as [number, number, number],
        color: C_CICD,
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
          <CurvedConnection
            key={index}
            start={conn.start}
            end={conn.end}
            color={conn.color}
            opacity={baseOpacity}
            drawProgress={progress}
          />
        );
      })}
    </>
  );
}
