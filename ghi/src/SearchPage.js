import React from "react";
import Search from "./Search";
import SearchArtist from "./SearchArtist";
import SearchTracks from "./SearchTracks";
import SearchAlbums from "./SearchAlbums";


function SearchPage() {
  return (
    <>
      <Search />
      <SearchArtist />
      <SearchTracks />
      <SearchAlbums />
    </>
  );
}

export default SearchPage;
