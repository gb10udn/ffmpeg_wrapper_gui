import Uploader from "./components/Uploader.tsx";
import Canvas from "./components/Canvas.tsx";
import Controller from "./components/Controller.tsx";
import Ffmpeg from "./components/Ffmpeg.tsx";
import Edit from "./components/Edit.tsx";
import { useRef, useState } from "react";

export type Position = {
  x: number | null,
  y: number | null,
}

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mute, setMute] = useState<boolean>(false);
  const [gif, setGif] = useState<boolean>(false);
  const [path, setPath] = useState<string | null>(null);
  const [movieDuration, setMovieDuration] = useState<number | undefined>(undefined);

  const [compress, setComporess] = useState<boolean>(false);
  const [cropStartPosition, setCropStartPosition] = useState<Position>({x: null, y: null})
  const [cropEndPosition, setCropEndPosition] = useState<Position>({x: null, y: null})

  const draw = (canvasRef: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<HTMLVideoElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current!, 0, 0, canvas!.width, canvas!.height);
  
      if (cropStartPosition.x && cropStartPosition.y && cropEndPosition.x && cropEndPosition.y) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(cropStartPosition.x, cropStartPosition.y, cropEndPosition.x - cropStartPosition.x, cropEndPosition.y - cropStartPosition.y);
        ctx.stroke();
      }
    }
  }

  return (
    <div className="mx-3 mt-3">
      <h1 className="text-3xl font-bold">ffmpeg wrapper gui</h1>
      <Ffmpeg />
      <Uploader
        videoRef={videoRef}
        canvasRef={canvasRef}
        path={path}
        setPath={setPath}
        setMovieDuration={setMovieDuration}
        draw={draw}
      />
      <Controller mute={mute} setMute={setMute} gif={gif} setGif={setGif} compress={compress} setComporess={setComporess} />
      <Edit cropStartPosition={cropStartPosition} cropEndPosition={cropEndPosition} path={path} />
      
      <Canvas
        canvasRef={canvasRef}
        videoRef={videoRef}
        cropStartPosition={cropStartPosition}
        cropEndPosition={cropEndPosition}
        setCropStartPosition={setCropStartPosition}
        setCropEndPosition={setCropEndPosition}
        movieDuration={movieDuration}
        draw={draw}
      />
    </div>
  );
}

export default App;