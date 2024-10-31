import React from "react";
import { Link } from "react-router-dom";
import { useGetSpecificPlaylistQuery } from "../app/apiSlice";

function PlaylistLink({ playlist }) {
  const {
    data: playlistData,
    error,
    isLoading,
  } = useGetSpecificPlaylistQuery(playlist.id);

  return (
    <Link to={`/${playlist.id}`}>
      {isLoading ? "Loading..." : playlistData.name}
    </Link>
  );
}

export default PlaylistLink;
