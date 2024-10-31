import {
  useGetSpotifyTrackQuery,
  useGetAllPlaylistQuery,
} from "./app/apiSlice";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import CreateSongButton from "./playlist_functions/CreateSong.js";
import { useParams } from "react-router-dom";

const SongInfo = () => {
  const { id } = useParams();
  const { data: track, isLoading } = useGetSpotifyTrackQuery(id);
  const { data: playLists } = useGetAllPlaylistQuery();
  const [selectedPlaylist, setSelectedPlayList] = useState("");
  const [selectedPlaylistName, setSelectedPlayListName] = useState("playlist");

  const handleSubmit = (e, id, name) => {
    e.preventDefault();
    setSelectedPlayList(id);
    setSelectedPlayListName(name);
  };

  const params = {
    playlist_id: selectedPlaylist,
    track_number: track && track[0]["track_info"]["track_number"],
    name: track && track[0]["track_info"]["name"],
    album: track && track[0]["album_info"]["name"],
    album_id: track && track[0]["album_info"]["id"],
    album_image: track && track[0]["album_info"]["image"],
    duration: track && track[0]["track_info"]["duration_ms"],
    spotify_id: track && track[0]["track_info"]["id"],
    artist: track && track[0]["track_info"]["artist_name"],
  };

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    track && (
      <div className="row mt-3">
        <h1>
          <img
            src={track[0]["album_info"]["image"]}
            width="200px"
            height="200px"
          ></img>
        </h1>
        <h1>
          <Link
            className="link-primary text-decoration-none"
            to={`/spotify/albums/${track[0]["album_info"]["id"]}`}
          >
            {track[0]["album_info"]["name"]}
          </Link>
        </h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Length</th>
              <th>Select Playlist</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{track[0]["track_info"]["track_number"]}</td>
              <td>{track[0]["track_info"]["name"]}</td>
              <td>
                <div>
                  {track[0]["track_info"]["artist_name"]?.map((artist) => (
                    <React.Fragment key={artist.id}>
                      <Link
                        className="link-primary text-decoration-none"
                        to={`/spotify/artists/${artist.id}`}
                      >
                        {artist.artist_name}
                      </Link>
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </td>
              <td>
                {Math.floor(track[0]["track_info"]["duration_ms"] / 60000)}:
                {((track[0]["track_info"]["duration_ms"] / 1000) % 60)
                  .toFixed()
                  .padStart(2, "0")}
              </td>
              <td>
                <div className="dropdown">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdownMenuButton"
                    >
                      {selectedPlaylistName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {playLists &&
                        playLists?.playlists.map((playlist) => (
                          <Dropdown.Item
                            value={selectedPlaylist}
                            key={playlist.id}
                            onClick={(e) =>
                              handleSubmit(e, playlist.id, playlist.name)
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
                <CreateSongButton data={params} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  );
};
export default SongInfo;
