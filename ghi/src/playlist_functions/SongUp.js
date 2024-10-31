import {
  useMoveSongUpMutation,
} from "../app/apiSlice";

const SongUpButton = ({pId, idx}) => {

    const [songUp] = useMoveSongUpMutation();


  return (
    <>
      <button className="btn btn-success" onClick={() => songUp({pId, idx})}>
        Up
      </button>
    </>
  );
};


export default SongUpButton;
