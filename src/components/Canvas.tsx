import { Position } from "./types.ts";
import { DrawFunction } from './types.ts'
import { useState, useEffect } from "react";

type CanvasProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropStartPosition: Position,
  cropEndPosition: Position,
  setCropStartPosition: React.Dispatch<React.SetStateAction<Position>>,
  setCropEndPosition: React.Dispatch<React.SetStateAction<Position>>,
  movieDuration: number | undefined,
  draw: DrawFunction,
  movieWidth: number,
  movieHeight: number,
}

const Canvas = (props: CanvasProps) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    setIsDrawing(true);
    props.setCropStartPosition({x: null, y: null});
    props.setCropEndPosition({x: null, y: null});
  
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      props.setCropStartPosition({x: x, y: y});
    }
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (isDrawing === false) return;
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    
    const x = event.clientX - rect!.left;
    const y = event.clientY - rect!.top;
    props.setCropEndPosition({x: x, y: y});
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
    if (props.videoRef.current) {
      props.videoRef.current.currentTime = Number(e.target.value);
    }
  }

  useEffect(() => {
    const videoElement = props.videoRef.current;
    if (!videoElement) return;
    props.draw(props.canvasRef, props.videoRef, props.cropStartPosition, props.cropEndPosition);
  }, [props.cropStartPosition, props.cropEndPosition]);


  return (
    <>
    <video ref={props.videoRef} width={props.movieWidth} height={props.movieHeight} controls hidden />
    <canvas
      ref={props.canvasRef}
      onMouseDown={e => handleMouseDown(e, props.canvasRef)}
      onMouseMove={e => handleMouseMove(e, props.canvasRef)}
      onMouseUp={handleMouseUp}
      width={props.movieWidth}
      height={props.movieHeight}
      className="mt-5"
      >
    </canvas>
    <input type="range" min="0" max={props.movieDuration} step="0.1" value={currentTime} onChange={handleSlider}></input>
    </>
  )
}

export default Canvas