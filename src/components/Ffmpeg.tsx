import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const Ffmpeg = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<String>('');

  useEffect(() => {
    invoke("check_ffmpeg_downloaded", {}).then((result) => {
      setDownloaded(result as boolean);
      if (result === true) {
        console.log("already downloaded ffmpeg !!!");

      } else {
        if (downloading === false) {
          setDownloading(true);
          invoke("download_ffmpeg", {}).then(() => {
            console.log("Finished downloading ffmpeg !!!");
            setDownloaded(true);
            setDownloading(false);
            setHasError(false);
          }).catch((err) => {
            setErrorMessage(err);
            console.log(err);
            setHasError(true);
            setDownloaded(false);
            setDownloading(false);
          });
        }
      }
    }).catch((err) => {
      setErrorMessage(err);
      console.log(err);
      setHasError(true);
      setDownloaded(false);
      setDownloading(false);
    })
  }, []);

  return (
    <>
      { downloaded &&
        <div className="p-4 my-4 text-sm text-cyan-800 rounded-lg bg-cyan-50" role="alert">
          <span className="font-medium">ffmpeg downloaded success !!!</span> Upload and edit your movie
        </div>
      }

      { downloading && 
        <div className="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
          <span className="font-medium">ffmpeg downloading ...</span> Please wait a minutes ...
        </div>
      }

      { hasError &&
        <div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">ffmpeg downloaded failure ...</span> {errorMessage}
        </div>
      }
    </>
  )
}

export default Ffmpeg;