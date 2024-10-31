import { useDeleteSongMutation } from "../app/apiSlice";
import { useState, useEffect } from "react";

const DeleteSongButton = ({ sId, pId }) => {
  const [deleteSong] = useDeleteSongMutation();

  return (
    <>
      <button
        className="btn btn-danger"
        onClick={() => deleteSong({ sId, pId })}
      >
        Delete
      </button>
    </>
  );
};

export default DeleteSongButton;
