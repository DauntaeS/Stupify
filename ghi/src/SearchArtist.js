import { useSelector, useDispatch } from "react-redux";
import { useLazySearchSpotifyQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { search, reset } from "./app/searchSlice";

function SearchArtist() {
  const sSpotify = useSelector((state) => state.search.value);
  const dispatch = useDispatch();

  const params = {
    search: sSpotify,
    type: "artist,album,track",
    limit: 4,
    offset: 0,
  };

  const [trigger, { data, isLoading }] = useLazySearchSpotifyQuery();

  useEffect(() => {
    if (sSpotify) {
      trigger(params);
    }
  }, [sSpotify]);

  useEffect(() => {
    if (data) {
      dispatch(reset());
    }
  }, [data]);

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  return (
    data && (
      <div className="row mt-3">
        <h1>Related Artists</h1>
        <table className="table table-striped table-md">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data[0][0]?.artists_info.map((artist) => {
              return (
                <tr key={artist.id}>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/artists/${artist.id}`}
                    >
                      <img
                        src={artist.artist_image}
                        width="90px"
                        height="90px"
                      ></img>
                    </Link>
                  </td>
                  <td>
                    <Link
                      className="link-primary text-decoration-none"
                      to={`/spotify/artists/${artist.id}`}
                    >
                      {artist.name}
                    </Link>
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
export default SearchArtist;
