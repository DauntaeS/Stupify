import { useSelector } from "react-redux";
import { useLazySearchSpotifyQuery, useGetAllPlaylistQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import CreateSongButton from "./playlist_functions/CreateSong.js";

function SearchTracks() {
  const sSpotify = useSelector((state) => state.search.value);
  const { data: playLists } = useGetAllPlaylistQuery();
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const handlePlaylistChange = (index, playlistId, playlistName) => {
    const updatedPlaylists = [...selectedPlaylists];
    updatedPlaylists[index] = { id: playlistId, name: playlistName };
    setSelectedPlaylists(updatedPlaylists);
  };


  const params = {
    search: sSpotify,
    type: "artist,album,track",
    limit: 4,
    offset: 0,
  };
  const [trigger,{ data, isLoading }] = useLazySearchSpotifyQuery();

  useEffect(() => {
    if (sSpotify) {
      trigger(params)
    }
  }, [sSpotify])
  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    data && (
      <div className="row mt-3">
        <h1>Related Tracks</h1>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Artist</th>
              <th>Length</th>
              <th>Playlists</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {data[0][1]?.tracks_info.map((track, index) => {
              const artistLinks = track.artist_name.map((artist, index) => (
                <Link
                  className="link-primary text-decoration-none"
                  key={index}
                  to={`/spotify/artists/${artist["id"]}`}
                >
                  {artist.artist_name}
                  <br />
                </Link>
              ));

              return (
                <tr key={track.id}>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/tracks/${track.id}`}
                    >
                      <img
                        src={track.album_image}
                        width="90px"
                        height="90px"
                      ></img>
                    </Link>
                  </td>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/tracks/${track.id}`}
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td>{artistLinks}</td>
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
                        track_number: track && track["track_number"],
                        name: track && track["name"],
                        album: track && track["album_name"],
                        album_id: track && track["album_id"],
                        album_image: track && track["album_image"],
                        duration: track && track["duration_ms"],
                        spotify_id: track && track["id"],
                        artist: track && track["artist_name"],
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
}
export default SearchTracks;
