import React from "react";

export type Position = {
  x: number | null,
  y: number | null,
}

export type DrawFunction = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  videoRef: React.RefObject<HTMLVideoElement>,
  cropStartPosition: Position,
  cropEndPosition: Position,
) => void;