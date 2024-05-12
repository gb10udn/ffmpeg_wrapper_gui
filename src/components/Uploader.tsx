type UploaderProps = {
  videoRef: React.RefObject<HTMLVideoElement>,
}

const Uploader = (props: UploaderProps) => {
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoObject = URL.createObjectURL(file);
      if (props.videoRef.current) {
        props.videoRef.current.src = videoObject;
      }
    }
  }

  // TODO: 240508 ドラッグアンドドロップでアップロードできるようにせよ。
  return (
    <>
      <input type="file" accept=".mp4" onChange={upload} />
    </>
  )
}

export default Uploader