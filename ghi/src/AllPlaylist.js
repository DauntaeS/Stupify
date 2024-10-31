import { useGetAllPlaylistQuery } from "./app/apiSlice";
import DeletePlayListButton from "./playlist_functions/PlayListFunctions";
import AllSongsInPlayList from "./SongsInPlaylist";
import UpdateButton from "./playlist_functions/UpdatePlayList";
import CreatePlayListButton from "./playlist_functions/CreatePlayList";
import { Link } from "react-router-dom";

function AllPlaylist() {
  const { data: playlists, error, isLoading } = useGetAllPlaylistQuery();

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    <div className="row mt-3">
      <h1>My Playlist</h1>
      <h3>
        <CreatePlayListButton />
      </h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Songs</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlists?.playlists.map((playlist) => {
            return (
              <tr key={playlist.id}>
                <td>
                  <Link
                  className="link-primary text-decoration-none"
                    to={`/playlist/${playlist.id}/songs`}
                    state={{ data: { playlist } }}
                  >
                    {playlist.name}
                  </Link>
                </td>
                <td>
                  <AllSongsInPlayList playlist_id={playlist.id} />
                </td>
                <td>
                  <UpdateButton playlist_data={playlist} />
                </td>
                <td>
                  <DeletePlayListButton id={playlist.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default AllPlaylist;
