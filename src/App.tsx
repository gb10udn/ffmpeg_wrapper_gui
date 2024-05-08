import Uploader from "./components/Uploader.tsx";
import Canvas from "./components/Canvas.tsx";
import { useRef } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="mx-3 mt-3">
      <h1 className="text-3xl font-bold">ffmpeg wrapper gui</h1>
      <Uploader videoRef={videoRef}/>
      <div className="mt-5"></div>
      <Canvas canvasRef={canvasRef} videoRef={videoRef} />
    </div>
  );
}

export default App;