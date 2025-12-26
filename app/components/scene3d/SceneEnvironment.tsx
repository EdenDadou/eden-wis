import {
  AnimatedStars,
  SpaceDust,
  Satellite,
  ShootingStar,
  ShootingStarBright,
  GradientSky,
} from "./background";
import SceneLighting from "./SceneLighting";

export default function SceneEnvironment() {
  return (
    <>
      <GradientSky />

      {/* Animated background elements */}
      <AnimatedStars />
      <SpaceDust />

      {/* Shooting stars */}
      <ShootingStar delay={2} />
      <ShootingStar delay={7} />
      <ShootingStar delay={12} />
      <ShootingStar delay={18} />
      <ShootingStar delay={24} />
      <ShootingStar delay={31} />

      {/* Brighter shooting stars */}
      <ShootingStarBright delay={5} />
      <ShootingStarBright delay={15} />
      <ShootingStarBright delay={28} />

      {/* Satellites */}
      <Satellite radius={18} speed={0.15} offset={0} tilt={0.3} />
      <Satellite radius={22} speed={0.1} offset={Math.PI} tilt={-0.5} />
      <Satellite radius={15} speed={0.2} offset={Math.PI / 2} tilt={0.8} />

      <SceneLighting />
    </>
  );
}
