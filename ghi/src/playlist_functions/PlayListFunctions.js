import { useDeletePlaylistMutation } from "../app/apiSlice";

const DeletePlayListButton = ({ id }) => {
  const [deletePlayList] = useDeletePlaylistMutation(id);

  return (
    <>
      <button className="btn btn-danger" onClick={() => deletePlayList(id)}>
        Delete
      </button>
    </>
  );
};

export default DeletePlayListButton;
