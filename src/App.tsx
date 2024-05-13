import Uploader from "./components/Uploader.tsx";
import Canvas from "./components/Canvas.tsx";
import Controller from "./components/Controller.tsx";
import Ffmpeg from "./components/Ffmpeg.tsx";
import { useRef, useState } from "react";


const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mute, setMute] = useState<boolean>(false);
  const [gif, setGif] = useState<boolean>(false);
  const [compress, setComporess] = useState<boolean>(false);

  return (
    <div className="mx-3 mt-3">
      <h1 className="text-3xl font-bold">ffmpeg wrapper gui</h1>
      <Ffmpeg />
      <Uploader videoRef={videoRef}/>
      <Controller mute={mute} setMute={setMute} gif={gif} setGif={setGif} compress={compress} setComporess={setComporess} />
      <Canvas canvasRef={canvasRef} videoRef={videoRef} />
    </div>
  );
}

export default App;