import { Position } from "./types.ts"
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

type EditProps = {
  mute: boolean,
  setMute: React.Dispatch<React.SetStateAction<boolean>>,
  gif: boolean,
  setGif: React.Dispatch<React.SetStateAction<boolean>>,
  compress: boolean,
  setComporess: React.Dispatch<React.SetStateAction<boolean>>,
  crop: boolean,
  setCrop: React.Dispatch<React.SetStateAction<boolean>>,
  cropStartPosition: Position,
  cropEndPosition: Position,
  path: string | null,
}

const Edit = (props: EditProps) => {
  const [compressParam, setCompressParam] = useState<number>(30);
  const [gifWidth, setGifWidth] = useState<number>(1280);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<String | null>(null);

  const edit = () => {
    setIsEditing(true);
    setMessage('Processing ...')
    if (props.mute) {
      invoke('mute', {
        src: props.path
      }).then(() => {
        setMessage('Success "mute" !!!');
        setIsEditing(false);
      }).catch((err) => {
        console.log(err);
        setMessage('Failure "mute" ...');
        setIsEditing(false);
      })

    } else if (props.gif) {
      invoke('create_gif', {
        src: props.path,
        width: gifWidth,
      }).then(() => {
        setMessage('Success "gif" !!!');
        setIsEditing(false);
      }).catch((err) => {
        console.log(err);
        setMessage('Failure "gif" ...');
        setIsEditing(false);
      })
    
    } else if (props.compress) {
      invoke('compress_movie', {
        src: props.path,
        compressParam: compressParam,
      }).then(() => {
        setMessage('Success "compress" !!!');
        setIsEditing(false);
      }).catch((err) => {
        console.log(err);
        setMessage('Failure "compress" ...');
        setIsEditing(false);
      })
    
    } else if (props.crop) {
      if (!(props.path && props.cropStartPosition.x && props.cropStartPosition.y && props.cropEndPosition.x && props.cropEndPosition.y)) return;
      invoke('crop', {
        src: props.path,
        startX: Math.trunc(Math.min(props.cropStartPosition.x, props.cropEndPosition.x)),  // INFO: 240514 Rust 側は start_x だが .tsx では startX のように変換されていた。
        startY: Math.trunc(Math.min(props.cropStartPosition.y, props.cropEndPosition.y)),
        width: Math.trunc(Math.abs(props.cropStartPosition.x - props.cropEndPosition.x)),
        height: Math.trunc(Math.abs(props.cropStartPosition.y - props.cropEndPosition.y)),
      }).then(() => {
        setMessage('Sucess "crop" !!!');
        setIsEditing(false);
      }).catch((err) => {
        console.log(err);
        setMessage('Failure "crop" ...');
        setIsEditing(false);
      });
    }
  }

  const setMuteOn = () => {
    props.setMute(true);
    props.setGif(false);
    props.setComporess(false);
    props.setCrop(false);
  }

  const setGifOn = () => {
    props.setMute(false);
    props.setGif(true);
    props.setComporess(false);
    props.setCrop(false);
  }

  const setCompressOn = () => {
    props.setMute(false);
    props.setGif(false);
    props.setComporess(true);
    props.setCrop(false);
  }

  const setCropOn = () => {
    props.setMute(false);
    props.setGif(false);
    props.setComporess(false);
    props.setCrop(true);
  }

  return (
    <div className="flex flex-row items-center pt-3">
      <button onClick={edit} disabled={isEditing} className="
        bg-cyan-500 hover:bg-cyan-700
        text-white py-2 px-4
        rounded-full
      ">
        Edit
      </button>
      <div className="flex items-center pl-4">
        <input id="mute" type="radio" name="edit" checked={props.mute} onChange={setMuteOn} className="h-4 w-4"/>
        <label htmlFor="mute" className="ml-1">mute</label>
      </div>
      <div className="flex items-center pl-4">
        <input id="gif" type="radio" name="edit" checked={props.gif} onChange={setGifOn} className="h-4 w-4" />
        <label htmlFor="gif" className="ml-1">gif</label>
      </div>
      <div className="flex items-center pl-4">
        <input id="compress" type="radio" name="edit" checked={props.compress} onChange={setCompressOn} className="h-4 w-4" />
        <label htmlFor="compress" className="ml-1">compress</label>
      </div>
      <div className="flex items-center pl-4">
        <input id="crop" type="radio" name="edit" checked={props.crop} onChange={setCropOn} className="h-4 w-4" />
        <label htmlFor="crop" className="ml-1">crop</label>
      </div>

      { props.compress &&
        <div className="pl-8">
          <label htmlFor="compress-param">compress parameter</label>
          <input type="number" className="ml-1 p-1 w-12 border rounded-md" value={compressParam} id="compress-param" onChange={(event) => {setCompressParam(Number(event.target.value))}}/>
        </div>
      }
      
      { props.gif &&
        <div className="pl-8">
          <label htmlFor="gif-width">gif width</label>
          <input type="number" className="ml-1 p-1 w-20 border rounded-md" value={gifWidth} id="gif-width" onChange={(event) => {setGifWidth(Number(event.target.value))}} />
        </div>
      }

      { message &&
        <div className="pl-8 font-bold">{ message }</div>
      }
    </div>
  );
}

export default Edit;