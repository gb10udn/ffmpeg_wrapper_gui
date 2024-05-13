import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const Ffmpeg = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    invoke("check_ffmpeg_downloaded", {}).then((result) => {
      setDownloaded(result as boolean);
      if (result === true) {
        console.log("already downloaded ffmpeg !!!")

      } else {
        if (downloading === false) {
          setDownloading(true);
          invoke("download_ffmpeg", {}).then(() => {
            console.log("Finished downloading ffmpeg !!!");
            setDownloaded(true);
            setDownloading(false);
          }).catch((err) => {
            console.log(err);
            setDownloaded(false);
            setDownloading(false);
          });
        }
      }
    }).catch((err) => {
      console.log(err);
      setDownloaded(false);
      setDownloading(false);
    })
  }, []);

  return (
    // TODO: 240513 
    <p>ffmpeg downloaded → {String(downloaded)} / downloading → {String(downloading)}</p>
  )
}

export default Ffmpeg;