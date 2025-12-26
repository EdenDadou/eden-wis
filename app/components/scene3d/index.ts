// Main Scene component
export { default as Scene3D } from "./Scene3D";
export { default as SceneEnvironment } from "./SceneEnvironment";
export { default as SceneContent } from "./SceneContent";

// Camera
export { default as CameraRig } from "./CameraRig";
export type { CameraRigProps } from "./CameraRig";
export * from "./camera.constants";
export * from "./camera.utils";

// Background elements
export * from "./background";

// Lighting
export { default as SceneLighting } from "./SceneLighting";

// World components
export * from "./world";

// Other 3D elements
export { default as PixelHeart3D } from "./PixelHeart3D";

// Cache and preloading
export * from "./cache";
