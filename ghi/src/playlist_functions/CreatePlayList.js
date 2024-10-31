import { useCreatePlaylistMutation } from "../app/apiSlice";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function CreatePlayListButton() {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("Custom Playlist");
  const [createPlayList] = useCreatePlaylistMutation();
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
    createPlayList(data);
    setInputValue("Custom Playlist");
    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Create Playlist
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Playlist</Modal.Title>
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

export default CreatePlayListButton;
