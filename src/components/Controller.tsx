type ControllerProps = {
  mute: boolean,
  setMute: React.Dispatch<React.SetStateAction<boolean>>,
  gif: boolean,
  setGif: React.Dispatch<React.SetStateAction<boolean>>,
  compress: boolean,
  setComporess: React.Dispatch<React.SetStateAction<boolean>>,
}

const Controller = (props: ControllerProps) => {
  return (
    <div className="flex-col">
      <div>
        <input type="checkbox" className="mr-2" id="mute" checked={props.mute} onChange={() => {props.setMute(!props.mute)}} />
        <label htmlFor="mute">mute</label>
      </div>
      <div>
        <input type="checkbox" className="mr-2" id="compress" checked={props.compress} onChange={() => {props.setComporess(!props.compress)}} />
        <label htmlFor="compress">compress</label>
      </div>
      <div>
        <input type="checkbox" className="mr-2" id="gif" checked={props.gif} onChange={() => {props.setGif(!props.gif)}} />
        <label htmlFor="gif">gif</label>
      </div>
    </div>
  )
}

export default Controller