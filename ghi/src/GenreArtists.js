import { useSearchSpotifyGenreQuery } from "./app/apiSlice";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function GenreArtists() {
  const location = useLocation();
  const { data } = location.state;

  const params = {
    search: data.genre,
    type: "artist,album,track",
    limit: 10,
  };

  const {
    data: genreArtistsData,
    error,
    isLoading,
  } = useSearchSpotifyGenreQuery(params);

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }


  return (
     genreArtistsData[0][0] ? <div className="row mt-3">
      <h1>Best {data.genre} Artists</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {genreArtistsData[0]?.map((artist) => {
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
    </div> : <h1> No artists Found!</h1>
  );
}
export default GenreArtists;
