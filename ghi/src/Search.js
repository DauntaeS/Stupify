import { useDispatch } from "react-redux";
import { useState } from "react";
import { search } from "./app/searchSlice";



function Search() {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();


  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(search(searchInput));
    setSearchInput("");
  };
  return (
    <div className="card text-end">
      <div className="card-body">
        <form className="row" onSubmit={handleSearchSubmit}>
          <div className="col-10">
            <input
              className="form-control form-control-lg form-control"
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="col-2">
            <button className="btn btn-lg btn-success" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
