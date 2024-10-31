import {
  useGetAllSongsInPlaylistQuery,
  useGetSpecificPlaylistQuery,
} from "./app/apiSlice";
import DeleteSongButton from "./playlist_functions/DeleteSong.js";
import SongDownButton from "./playlist_functions/SongDown.js";
import SongUpButton from "./playlist_functions/SongUp.js";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import UpdateButton from "./playlist_functions/UpdatePlayList.js";
import { useParams } from "react-router-dom";


function SpecificPlayList() {
  const location = useLocation();
  const { data } = location.state;
  const { id } = useParams();
  const {
    data: playlistData,
    error,
    isLoading,
  } = useGetAllSongsInPlaylistQuery(id);


  const {data:playListName} = useGetSpecificPlaylistQuery(data.playlist.id)

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }
  return (
    <div className="row mt-3">
      <h1>{playListName && playListName["name"]}</h1>
      <h3>
        <UpdateButton playlist_data={data.playlist} />
      </h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Duration</th>
            <th>Move</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlistData?.songs.map((song, index) => {
            const artistLinks = song.artist.map((artist) => (
              <Link
                className="link-primary text-decoration-none"
                key={artist.id}
                to={`/spotify/artists/${artist.id}`}
              >
                {artist.artist_name}
                <br />
              </Link>
            ));
            return (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={song["album_image"]}
                    width="50px"
                    height="50px"
                  ></img>
                </td>
                <td>
                  <Link
                    className="link-primary text-decoration-none"
                    to={`/spotify/tracks/${song.spotify_id}`}
                  >
                    {song.name}
                  </Link>
                </td>
                <td>{artistLinks}</td>
                <td>
                  <Link
                    className="link-primary text-decoration-none"
                    to={`/spotify/albums/${song.album_id}`}
                  >
                    {song.album}
                  </Link>
                </td>
                <td>
                  {Math.floor(song.duration / 60000)}:
                  {((song.duration / 1000) % 60).toFixed().padStart(2, "0")}
                </td>
                <td>
                  {index !== 0 ? (
                    <SongUpButton pId={data.playlist["id"]} idx={index} />
                  ) : null}{" "}
                  {index !== playlistData?.songs.length - 1 ? (
                    <SongDownButton pId={data.playlist["id"]} idx={index} />
                  ) : null}
                </td>
                <td>
                  <DeleteSongButton sId={song.id} pId={data.playlist["id"]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default SpecificPlayList;
