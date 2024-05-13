let isDrawing: boolean = false;
type Position = {x: number | null, y: number | null}
const startPosition: Position = { x: null, y: null};
const endPosition: Position = { x: null, y: null};

type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
}

const Canvas = (props: CanvasProps) => {
  setInterval(() => {
    draw(props.canvasRef, props.videoRef);
  }, 10)

  // TODO: 240508 ミラーリングが冗長なので、他の UI も検討せよ。(類似のライブラリがありそう)
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

const draw = (canvasRef: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<HTMLVideoElement>) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  
  if (ctx) {
    ctx.drawImage(videoRef.current!, 0, 0, canvas!.width, canvas!.height);

    if (startPosition.x && startPosition.y && endPosition.x && endPosition.y) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(startPosition.x, startPosition.y, endPosition.x - startPosition.x, endPosition.y - startPosition.y);
      ctx.stroke();
    }
  }
}

const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {    // FIXME: 240513 動画をアップロードしてない状態で書けてしまうので、修正せよ。
  isDrawing = true;
  startPosition.x = null;
  startPosition.y = null;
  endPosition.x = null;
  endPosition.y = null;

  const canvas = canvasRef.current;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    startPosition.x = x;
    startPosition.y = y;
  }
};

const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (isDrawing === false) return;
  const canvas = canvasRef.current;
  const rect = canvas?.getBoundingClientRect();
  
  endPosition.x = event.clientX - rect!.left;
  endPosition.y = event.clientY - rect!.top;
};

const handleMouseUp = () => {
  isDrawing = false;
};

export default Canvas