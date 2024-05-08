type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
}

const Canvas = (props: CanvasProps) => {

  setInterval(() => {
    draw(props.canvasRef, props.videoRef);
  }, 100)

  // TODO: 240508 ミラーリングが結構ダサいので、他の UI も検討せよ。(類似のアプリがありそう)
  return (
    <canvas ref={props.canvasRef} width={640} height={360} />
  )
}

const draw = (canvasRef: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<HTMLVideoElement>,) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx.drawImage(videoRef.current!, 0, 0, canvas!.width, canvas!.height);
  }
}

export default Canvas