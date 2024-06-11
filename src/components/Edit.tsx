import { Position } from "./types.ts"
import { invoke } from "@tauri-apps/api/tauri";

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
  const crop = () => {
    if (!(props.path && props.cropStartPosition.x && props.cropStartPosition.y && props.cropEndPosition.x && props.cropEndPosition.y)) return;

    invoke("crop", {
      src: props.path,
      startX: Math.trunc(Math.min(props.cropStartPosition.x, props.cropEndPosition.x)),  // INFO: 240514 Rust 側は start_x だが .tsx では startX のように変換されていた。
      startY: Math.trunc(Math.min(props.cropStartPosition.y, props.cropEndPosition.y)),
      width: Math.trunc(Math.abs(props.cropStartPosition.x - props.cropEndPosition.x)),
      height: Math.trunc(Math.abs(props.cropStartPosition.y - props.cropEndPosition.y)),
    }).then(() => {
      console.log('Sucess !!!');  // TODO: 240514 フロントエンドの UI にも通知せよ。(処理中なども表示できるといいかも？)
    }).catch((err) => {
      console.log(err);
    });
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
    // TODO: 240601 Edit (Crop など) の処理は時間がかかるので、実行中は再度クリックできないようにしていいかも？
    <>
      <ul>
        <li>
          <div>
            <input id="mute" type="radio" name="edit" checked={props.mute} onChange={setMuteOn} />
            <label htmlFor="mute">mute</label>
          </div>
        </li>
        <li>
          <div>
            <input id="gif" type="radio" name="edit" checked={props.gif} onChange={setGifOn} />
            <label htmlFor="gif">gif</label>
          </div>
        </li>
        <li>
          <div>
            <input id="compress" type="radio" name="edit" checked={props.compress} onChange={setCompressOn} />
            <label htmlFor="compress">compress</label>
          </div>
        </li>
        <li>
          <div>
            <input id="crop" type="radio" name="edit" checked={props.crop} onChange={setCropOn} />
            <label htmlFor="crop">crop</label>
          </div>
        </li>
      </ul>
      {/* TODO: 240611 radio ボタンの分岐によって、適切にバックエンドに処理を投げること。 */}
      <button onClick={crop}>Edit</button>
    </>
  );
}

export default Edit;