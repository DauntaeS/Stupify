import { useGetSpotifyRandomQuery } from "./app/apiSlice";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
} from "mdb-react-ui-kit";
import "./App.css";
import Rick from "./random-audio/rick.MP3";
import { Link } from "react-router-dom";

function SpotifyRandom() {
  const { data, error, isLoading } = useGetSpotifyRandomQuery({ count: 10 },{ refetchOnMountOrArgChange:true});

  const navigate = useNavigate();

  if (isLoading) return <>Loading...</>;

  return (
    <div>
      {data["rickrolld"] ? (
        <div className="d-flex justify-content-center pt-4">
          <div className="rickroll-background">
            <div
              id="rick-text"
              className="ct-animate-blink "
              height="100%"
              width="100%"
            >
              {data["rickrolld"]}
            </div>
            <div className="rick-audio">
              <audio src={Rick} controls autoPlay />
              <br></br>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center pt-4">
          <MDBCol sm="4">
            <MDBCard>
              <MDBCardImage src={data.album_image} position="top" alt="..." />
              <MDBCardBody>
                <MDBCardTitle>
                  <Link
                    className="link-primary text-decoration-none"
                    to={`/spotify/tracks/${data.track_id}`}
                  >
                    {data.track_name}
                  </Link>
                </MDBCardTitle>
                <MDBCardText>
                  Artist:
                  <Link
                    className="link-primary text-decoration-none"
                    to={`/spotify/artists/${data.artist_id}`}
                  >
                    {data.artist_name}
                  </Link>
                </MDBCardText>
                <MDBCardText>
                  Album:
                  <Link
                    className="link-primary text-decoration-none"
                    to={`/spotify/albums/${data.album_id}`}
                  >
                    {data.album_name}
                  </Link>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </div>
      )}
      <div className="d-flex justify-content-center pt-3">
        <Button
          onClick={() => navigate(0)}
          className="btn-primary"
          id="rick-button"
        >
          Feeling Lucky?
        </Button>
      </div>
    </div>
  );
}

export default SpotifyRandom;
