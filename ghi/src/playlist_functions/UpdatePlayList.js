import { useUpdatePlaylistMutation } from "../app/apiSlice";

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function UpdateButton(playlist_data) {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(
    playlist_data?.playlist_data["name"]
  );
  const [updatePlayList] = useUpdatePlaylistMutation();
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const handleSaveChanges = () => {
    const data = {
      name: inputValue,
    };
    updatePlayList({ id: playlist_data?.playlist_data["id"], data });
    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your new Playlist name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            id="playlistname"
            value={inputValue}
            onChange={handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateButton;
