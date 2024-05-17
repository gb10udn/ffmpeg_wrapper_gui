import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';

type UploaderProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
  path: string | null,
  setPath: React.Dispatch<React.SetStateAction<string | null>>,
}

const Uploader = (props: UploaderProps) => {
  const upload = async () => {
    const temp_path = await open();
    if (typeof temp_path === 'string') {
      props.setPath(temp_path);
      if (props.videoRef.current && typeof props.path === 'string') {
        props.videoRef.current.src = convertFileSrc(props.path);
      }
    }    
  }

  // TODO: 240508 ドラッグアンドドロップでアップロードできるようにせよ。
  return (
    <button onClick={upload}>File Upload</button>
  )
}

export default Uploader