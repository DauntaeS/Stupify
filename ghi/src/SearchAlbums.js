import { useSelector } from "react-redux";
import { useLazySearchSpotifyQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

function SearchAlbums() {
  const sSpotify = useSelector((state) => state.search.value);

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
        <h1>Related Albums</h1>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Album</th>
              <th>Name</th>
              <th>Release Date</th>
              <th>Total Tracks</th>
            </tr>
          </thead>
          <tbody>
            {data[0][2]?.albums_info.map((album) => {
              return (
                <tr key={album.id}>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/albums/${album.id}`}
                    >
                      <img src={album.image} width="90px" height="90px"></img>
                    </Link>
                  </td>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/albums/${album.id}`}
                    >
                      {album.name}
                    </Link>
                  </td>
                  <td>{album.release_date}</td>
                  <td>{album.total_tracks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );
}
export default SearchAlbums;
