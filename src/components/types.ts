import React from "react";

export type DrawFunction = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  videoRef: React.RefObject<HTMLVideoElement>
) => void;