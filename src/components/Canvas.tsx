import { Position } from "../App.tsx";
import { useState, useEffect } from "react";

type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
  cropStartPosition: Position,
  cropEndPosition: Position,
  setCropStartPosition: React.Dispatch<React.SetStateAction<Position>>,
  setCropEndPosition: React.Dispatch<React.SetStateAction<Position>>,
  movieDuration: number | undefined,
}

const Canvas = (props: CanvasProps) => {  // FIXME: 240523 movie をアップロードしていないときに、四角が何重にも描画される問題を修正せよ。
  let [isDrawing, setIsDrawing] = useState<boolean>(false);
  let [currentTime, setCurrentTime] = useState<number>(0.0);

  const draw = (canvasRef: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<HTMLVideoElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current!, 0, 0, canvas!.width, canvas!.height);
  
      if (props.cropStartPosition.x && props.cropStartPosition.y && props.cropEndPosition.x && props.cropEndPosition.y) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(props.cropStartPosition.x, props.cropStartPosition.y, props.cropEndPosition.x - props.cropStartPosition.x, props.cropEndPosition.y - props.cropStartPosition.y);
        ctx.stroke();
      }
    }
  }
  
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
    const handelTimeUpdate = () => {
      draw(props.canvasRef, props.videoRef);
    }
    handelTimeUpdate();
    videoElement.addEventListener('timeupdate', handelTimeUpdate);  // EDIT: 240602 videoRef で操作しないので、非表示にして、削除せよ。

    return () => {
      videoElement.removeEventListener('timeupdate', handelTimeUpdate);
    };
  }, [props.cropStartPosition, props.cropEndPosition]);


  // TODO: 240521 横幅 (640 px) が一致しない場合でも計算して合わせる
  return (
    <>
    <video ref={props.videoRef} width={640} height={360} controls />
    <canvas
      ref={props.canvasRef}
      onMouseDown={e => handleMouseDown(e, props.canvasRef)}
      onMouseMove={e => handleMouseMove(e, props.canvasRef)}
      onMouseUp={handleMouseUp}
      width={640}
      height={360}
      className="mt-5"
      >
    </canvas>

    {/* EDIT: 240508 ミラーリングが冗長なので、他の UI も検討せよ。(類似のライブラリがありそう or 動画部分隠して、時間をスクロールで指定してカレント値の指定をするといいかも？) */}
    <input type="range" min="0" max={props.movieDuration} step="0.1" value={currentTime} onChange={handleSlider}></input>
    </>
  )
}

export default Canvas