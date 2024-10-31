import React, { useState } from "react";
import {
  useLazyGetSpotifyRecommendationsQuery,
  useGetAllGenreQuery,
  useGetAllPlaylistQuery
} from "./app/apiSlice";
import { Dropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreateSongButton from "./playlist_functions/CreateSong.js";

function Recommendations() {
  const [inputValue, setInputValue] = useState("");
  const { data: playLists } = useGetAllPlaylistQuery();
  const [selectedGenre, setSelectedGenre] = useState("Genre");

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handlePlaylistChange = (index, playlistId, playlistName) => {
    const updatedPlaylists = [...selectedPlaylists];
    updatedPlaylists[index] = { id: playlistId, name: playlistName };
    setSelectedPlaylists(updatedPlaylists);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const { data: genres } = useGetAllGenreQuery();

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const params = {
    genre: selectedGenre,
    artist: inputValue,
  };
  const [trigger, { data }] = useLazyGetSpotifyRecommendationsQuery();

  const handleTrigger = () => {
    trigger(params);
  };



  return (
    <div className="card text-end">
      <div className="card-body">
        <form className="row align-items-center">
          <div className="col-md-8 mb-3">
            <input
              className="form-control form-control-lg form-control"
              type="text"
              id="seedArtist"
              placeholder="Enter artist & select genre from dropdown"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-1 mb-3">
            <Dropdown>
              <Dropdown.Toggle
                variant="secondary btn-lg"
                id="dropdownMenuButton"
              >
                {selectedGenre}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {genres &&
                  genres[0]?.genres.map((genre) => (
                    <Dropdown.Item
                      value={selectedGenre}
                      key={genre}
                      onClick={(e) => handleGenreSelect(genre)}
                    >
                      {genre}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-md-3 mb-3">
            <Button variant="success btn-lg" onClick={handleTrigger}>
              Search
            </Button>
          </div>
        </form>
        <div></div>

        {data && (
          <div className="text-start">
            <h1>
              {inputValue} & {selectedGenre} Song recommendations:
            </h1>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Playlists</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                {data[0]?.map((track, index) => {
                  return (
                    <tr key={track.id}>
                      <td>
                        <Link
                          className="link-primary text-decoration-none"
                          to={`/spotify/tracks/${track.id}`}
                        >
                          <img
                            src={track.image}
                            width="90px"
                            height="90px"
                            alt=""
                          />
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
                        album_image: track && track["image"],
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
        )}
      </div>
    </div>
  );
}

export default Recommendations;
