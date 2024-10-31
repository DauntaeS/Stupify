import {
  useMoveSongDownMutation,
} from "../app/apiSlice";

const SongDownButton = ({pId, idx}) => {
    const [songDown] = useMoveSongDownMutation();


  return (
    <>
      <button className="btn btn-primary" onClick={() => songDown({pId, idx})}>
        Down
      </button>
    </>
  );
};


export default SongDownButton;
