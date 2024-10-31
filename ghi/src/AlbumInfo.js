import {
  useGetSpotifyAlbumQuery,
  useGetAllPlaylistQuery,
} from "./app/apiSlice";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import React, { useState, } from "react";
import CreateSongButton from "./playlist_functions/CreateSong.js";


const AlbumInfo = () => {
  const { id } = useParams();
  const { data: playLists } = useGetAllPlaylistQuery();
  const { data: albums, isLoading } = useGetSpotifyAlbumQuery(id);

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handlePlaylistChange = (index, playlistId, playlistName) => {

    const updatedPlaylists = [...selectedPlaylists];
    updatedPlaylists[index] = { id: playlistId, name: playlistName };
    setSelectedPlaylists(updatedPlaylists);
  };

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    albums && (
      <div className="row mt-3">
        <h1>
          <img
            src={albums[0]["album_info"]["image"]}
            width="200px"
            height="200px"
          ></img>
        </h1>
        <h1>{albums[0]["album_info"]["name"]}</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Length</th>
              <th>Playlists</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {albums[0]?.tracks.map((track, index) => {
              return (
                <tr key={track.id}>
                  <td>{track.track_number}</td>
                  <td>
                    <Link
                    className="link-primary text-decoration-none"
                      to={`/spotify/tracks/${track.id}`}
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td>
                    {Math.floor(track.duration_ms / 60000)}:
                    {((track.duration_ms / 1000) % 60)
                      .toFixed()
                      .padStart(2, "0")}
                  </td>
                  <td>
                    <div className="dropdown">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id={`dropdownMenuButton_${index}`}
                        >
                          {selectedPlaylists[index]
                            ? selectedPlaylists[index].name
                            : "Select Playlist"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {playLists &&
                            playLists?.playlists.map((playlist) => (
                              <Dropdown.Item
                                key={playlist.id}
                                onClick={() =>
                                  handlePlaylistChange(
                                    index,
                                    playlist.id,
                                    playlist.name
                                  )
                                }
                              >
                                {playlist.name}
                              </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                  <td>
                    <CreateSongButton
                      data={{
                        playlist_id:
                          selectedPlaylists[index] &&
                          selectedPlaylists[index].id,
                        track_number: track["track_number"],
                        name: track["name"],
                        album: albums && albums[0]["album_info"]["name"],
                        album_id: albums && albums[0]["album_info"]["id"],
                        album_image: albums && albums[0]["album_info"]["image"],
                        duration: track["duration_ms"],
                        spotify_id: track["id"],
                        artist: track["artist_name"],
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );
};

export default AlbumInfo;
