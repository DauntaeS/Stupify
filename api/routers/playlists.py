from fastapi import APIRouter, Depends, HTTPException
from models import (
    PlayLists,
    PlayListIn,
    PlayListOut,
    DeleteStatus,
)
from queries.playlists import PlayListQueries
from authenticator import authenticator


router = APIRouter()


@router.get("/api/playlists", response_model=PlayLists)
def find_all(
    q: str | None = None,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    return {"playlists": queries.find_all(account_id=account_data["id"])}


@router.post("/api/playlists", response_model=PlayListOut)
def create_playlist(
    playlist_in: PlayListIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    return queries.create_playlist(
        playlist_in=playlist_in, account_id=account_data["id"]
    )


@router.get("/api/playlists/{playlist_id}", response_model=PlayListOut)
def get_playlist(
    playlist_id: str,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    playlist = queries.find_one(
        playlist_id=playlist_id, account_id=account_data["id"]
    )
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist


@router.delete("/api/playlists/{playlist_id}", response_model=DeleteStatus)
def delete_playlist(
    playlist_id: str,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    return {
        "status": queries.delete(
            playlist_id=playlist_id, account_id=account_data["id"]
        )
    }


@router.put("/api/playlists/{playlist_id}", response_model=PlayListOut)
def update_playlist(
    playlist_id: str,
    playlist_in: PlayListIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    playlist = queries.update(
        playlist_id=playlist_id,
        playlist_changes=playlist_in,
        account_id=account_data["id"],
    )

    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not Found")
    return playlist


@router.put("/api/playlists/{playlist_id}/down")
def move_playlist_down(
    idx: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    result = queries.move_down(account_id=account_data["id"], idx=idx)
    return result


@router.put("/api/playlists/{playlist_id}/up")
def move_playlist_up(
    idx: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: PlayListQueries = Depends(),
):
    result = queries.move_up(account_id=account_data["id"], idx=idx)
    return result
