import { useSelector, useDispatch } from "react-redux";
import { useGetAllGenreQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
} from "mdb-react-ui-kit";
import "./App.css";
import { search, reset } from "./app/searchSlice";
import React, { useEffect } from "react";

function AllGenreList() {
  const { data, isLoading } = useGetAllGenreQuery();
  const dispatch = useDispatch();

  const searchCriteria = useSelector((state) => state.search.value);

  // useEffect(() =>{
  //   // if (filteredData){
  //   //   dispatch(reset())}
  // }, []);

  if (isLoading) {
    return <progress className="progress is-primary" max="100"></progress>;
  }

  const filteredData = () => {
    if (searchCriteria) {
      const temp = searchCriteria;
      // dispatch(reset());
      return data[0]?.genres.filter(
        (genre) => {
          return genre.includes(temp);
        }
        // genre.includes(temp))
      );
    }
    return data[0]?.genres;
  };

  return (
    <div className="card-container">
      {filteredData()?.map((genre, index) => (
        <MDBCol sm="2" key={index}>
          <MDBCard>
            <MDBCardImage
              src="https://i.seadn.io/gcs/files/7187742030eeb68b16f478c47aece4dd.gif"
              position="top"
              alt="..."
            />
            <MDBCardBody>
              <MDBCardTitle className="card-title">
                <Link
                  className="link-primary text-decoration-none"
                  to={`/spotify/genres`}
                  state={{ data: { genre } }}
                >
                  {genre}
                </Link>
              </MDBCardTitle>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </div>
  );
}

export default AllGenreList;
