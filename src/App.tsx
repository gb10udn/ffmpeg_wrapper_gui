import Uploader from "./components/Uploader.tsx";
import Canvas from "./components/Canvas.tsx";
import { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    invoke("check_ffmpeg_downloaded", {}).then((result) => {
      setDownloaded(result as boolean);
      if (result === true) {
        console.log("already downloaded ffmpeg !!!")
      } else {
        invoke("download_ffmpeg", {}).then(() => {
          console.log("Finished downloading ffmpeg !!!");
          setDownloaded(true);
        }).catch((err) => {
          console.log(err);
          setDownloaded(false);
        });      
      }
    }).catch((err) => {
      console.log(err);
      setDownloaded(false);
    })
  }, []);

  return (
    <div className="mx-3 mt-3">
      <h1 className="text-3xl font-bold">ffmpeg wrapper gui</h1>
      {/* TODO: 240510 もう少し直感的に理解できそうな表記にする */}
      <p>ffmpeg downloaded → {String(downloaded)} </p>
      <Uploader videoRef={videoRef}/>
      <div className="mt-5"></div>
      <Canvas canvasRef={canvasRef} videoRef={videoRef} />
    </div>
  );
}

export default App;