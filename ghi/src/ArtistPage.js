import { useGetSpotifyArtistQuery, useGetAllPlaylistQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
} from "mdb-react-ui-kit";
import "./App.css";
import { Dropdown } from "react-bootstrap";
import React, { useState } from "react";
import CreateSongButton from "./playlist_functions/CreateSong.js";



function ArtistPage() {
  const { id } = useParams();
  const { data: playLists } = useGetAllPlaylistQuery();
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handlePlaylistChange = (index, playlistId, playlistName) => {
    const updatedPlaylists = [...selectedPlaylists];
    updatedPlaylists[index] = { id: playlistId, name: playlistName };
    setSelectedPlaylists(updatedPlaylists);
  };

  const { data: artist, isLoading } = useGetSpotifyArtistQuery(id);

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    artist && (

      <div className="row mt-3" >
        <div className="d-flex justify-content-center pt-4">
          <h1>
          <img
            src={artist[0]["artist_info"][0]["image"]}
            width="200px"
            height="200px"
          ></img>
        </h1>
        </div>

        <h1>{artist[0]["artist_info"][0]["name"]}</h1>
        <h5>Top Tracks</h5>
                <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Album</th>
              <th>Artist</th>
              <th>Length</th>
              <th>Playlists</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {artist[0]?.top_tracks_info.map((track, index) => {
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
                    <img
            src={track.album_image}
            width="50px"
            height="50px"
          ></img></td>
                  <td>
                    <Link
                    className="link-primary text-decoration-none"
                      to={`/spotify/tracks/${track.id}`}
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                    className="link-primary text-decoration-none"
                      to={`/spotify/albums/${track.album_id}`}
                    >
                      {track.album_name}
                    </Link>
                  </td>
                  <td>
                  {artistLinks}
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
                        album: track && track["album_name"],
                        album_id: track && track["album_id"],
                        album_image: track && track["album_image"],
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
        <h5>Albums</h5>
            <div className="card-container">
      {artist[0]?.albums_info.map((album) => (
        <MDBCol sm="2" key={album.id}>
          <MDBCard>
            <MDBCardImage
              src={album.image}
              position="top"
              alt="..."
            />
            <MDBCardBody>
              <MDBCardTitle className="card-title">
                <Link
                  className="link-primary text-decoration-none"
                  to={`/spotify/albums/${album.id}`}
                >
                  {album.name}
                </Link>
              </MDBCardTitle>
                <MDBCardText>
                    {album.release_date}
                </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </div>
      </div>
    )
  );
}
export default ArtistPage;
