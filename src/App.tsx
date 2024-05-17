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
  const [compress, setComporess] = useState<boolean>(false);
  const cropStartPosition: Position = {x: null, y: null};
  const cropEndPosition: Position = {x: null, y: null};

  return (
    <div className="mx-3 mt-3">
      <h1 className="text-3xl font-bold">ffmpeg wrapper gui</h1>
      <Ffmpeg />
      <Uploader videoRef={videoRef} path={path} setPath={setPath} />
      <Controller mute={mute} setMute={setMute} gif={gif} setGif={setGif} compress={compress} setComporess={setComporess} />
      <Edit cropStartPosition={cropStartPosition} cropEndPosition={cropEndPosition} path={path} />
      <Canvas canvasRef={canvasRef} videoRef={videoRef} cropStartPosition={cropStartPosition} cropEndPosition={cropEndPosition} />
    </div>
  );
}

export default App;