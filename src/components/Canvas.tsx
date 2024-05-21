import { Position } from "../App.tsx";

type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
  cropStartPosition: Position,
  cropEndPosition: Position,
}

const Canvas = (props: CanvasProps) => {
  let isDrawing: boolean = false;

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
    requestAnimationFrame(() => draw(canvasRef, videoRef));
  }
  
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    isDrawing = true;
    props.cropStartPosition.x = null;
    props.cropStartPosition.y = null;
    props.cropEndPosition.x = null;
    props.cropEndPosition.y = null;
  
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      props.cropStartPosition.x = x;
      props.cropStartPosition.y = y;
    }
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (isDrawing === false) return;
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    
    props.cropEndPosition.x = event.clientX - rect!.left;
    props.cropEndPosition.y = event.clientY - rect!.top;
  };
  
  const handleMouseUp = () => {
    isDrawing = false;
  };

  requestAnimationFrame(() => draw(props.canvasRef, props.videoRef));


  // TODO: 240508 ミラーリングが結構ダサいので、他の UI も検討せよ。(類似のライブラリがありそう)
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
    </>
  )
}

export default Canvas