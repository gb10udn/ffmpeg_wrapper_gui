import { useEffect } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { DrawFunction, Position } from './types.ts'


type UploaderProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  path: string | null,
  setPath: React.Dispatch<React.SetStateAction<string | null>>,
  setMovieDuration: React.Dispatch<React.SetStateAction<number | undefined>>,
  cropStartPosition: Position,
  cropEndPosition: Position,
  draw: DrawFunction,
  setMovieWidth: React.Dispatch<React.SetStateAction<number>>,
  setMovieHeight: React.Dispatch<React.SetStateAction<number>>,
}

const Uploader = (props: UploaderProps) => {
  const handleTimeUpdate = () => {
    props.draw(props.canvasRef, props.videoRef, props.cropStartPosition, props.cropEndPosition);
  }

  useEffect(() => {
    const videoElement = props.videoRef.current;
    if (videoElement && typeof props.path === 'string') {
      videoElement.src = convertFileSrc(props.path);
      videoElement.addEventListener('loadeddata', () => {
        props.setMovieWidth(videoElement.videoWidth);  // TODO: 240609 App の画面より大きい動画だとはみ出るので、縮小できるようにせよ。
        props.setMovieHeight(videoElement.videoHeight);
        props.setMovieDuration(videoElement.duration);
        videoElement.currentTime = 0.0;  // INFO: 240603 これを入れると、読み込み直後に canvas に video のイメージが正しく描画される。(???)
      });
    }
  }, [props.path]);

  useEffect(() => {
    const videoElement = props.videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [props.cropStartPosition, props.cropEndPosition])

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