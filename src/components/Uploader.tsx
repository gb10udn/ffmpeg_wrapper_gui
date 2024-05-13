import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';

type UploaderProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
}

const Uploader = (props: UploaderProps) => {
  const upload = async () => {
    const file = await open();
    if (typeof file === 'string') {
      if (props.videoRef.current) {
        props.videoRef.current.src = convertFileSrc(file);
      }
    }    
  }

  // TODO: 240508 ドラッグアンドドロップでアップロードできるようにせよ。
  return (
    <button onClick={upload}>File Upload</button>
  )
}

export default Uploader