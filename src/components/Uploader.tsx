import { useEffect } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';

type UploaderProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  path: string | null,
  setPath: React.Dispatch<React.SetStateAction<string | null>>,
  setMovieDuration: React.Dispatch<React.SetStateAction<number | undefined>>,
  draw: any,  // HACK: 240603 型指定すること (type で独自型を定義する？)
}

const Uploader = (props: UploaderProps) => {
  useEffect(() => {
    const handleTimeUpdate = () => {
      props.draw(props.canvasRef, props.videoRef);
    }
    const videoElement = props.videoRef.current;
    if (videoElement && typeof props.path === 'string') {
      videoElement.src = convertFileSrc(props.path);
      videoElement.addEventListener('loadeddata', () => {
        props.setMovieDuration(videoElement.duration);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.currentTime = 0;  // INFO: 240603 これを入れると、読み込み直後に canvas に video のイメージが正しく描画される。
      });
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [props.path]);

  const upload = async () => {
    const temp_path = await open();
    if (typeof temp_path === 'string') {
      props.setPath(temp_path);
    }
  }

  // TODO: 240508 ドラッグアンドドロップでアップロードできるようにせよ。
  return (
    <button onClick={upload}>File Upload</button>
  )
}

export default Uploader