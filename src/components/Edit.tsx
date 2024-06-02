import { Position } from "../App.tsx"
import { invoke } from "@tauri-apps/api/tauri";

type EditProps = {
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

  return (
    // TODO: 240601 Edit (Crop など) の処理は時間がかかるので、実行中は再度クリックできないようにしていいかも？
    <button onClick={crop}>Edit</button>
  );
}

export default Edit;