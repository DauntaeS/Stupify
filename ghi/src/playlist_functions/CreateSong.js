import { useCreateSongInPlaylistMutation } from "../app/apiSlice";

const CreateSongButton = ({ data }) => {
  const [createSong] = useCreateSongInPlaylistMutation();

  const handleCreateSong = async () => {
    try {
      const response = await createSong(data);
    } catch (error) {
      if (error.message === "Song already in playlist") {
        alert("Song already exists in the playlist.");
      } else {
      }
    }
  };

  return (
    <>
      <button className="btn btn-success" onClick={handleCreateSong}>
        +
      </button>
    </>
  );
};

export default CreateSongButton;
