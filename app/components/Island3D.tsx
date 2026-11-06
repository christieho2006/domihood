"use client";

// Compatibility entry point: all island rendering now uses the 2D storybook scene.
// Keeping this adapter preserves existing page and exploration integrations while
// the rest of the old Three.js-specific surface is migrated in later steps.
import Island2D from "./Island2D";

type Props = {
  angle: number;
  zoom: number;
  onEnter?: () => void;
  onAngleChange?: (angle: number) => void;
  freeRotate?: boolean;
};

export default function IslandScene({ angle, zoom, onEnter, onAngleChange, freeRotate = false }: Props) {
  return <Island2D angle={angle} zoom={zoom} onEnter={onEnter} onAngleChange={onAngleChange} freeRotate={freeRotate} />;
}
