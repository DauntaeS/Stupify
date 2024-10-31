from fastapi import APIRouter, Depends, HTTPException
from models import DeleteStatus, SongIn, SongOut, Songs
from queries.songs import SongsQueries
from authenticator import authenticator

router = APIRouter()


@router.get("/api/songs", response_model=Songs)
def find_all_songs(q: str | None = None, queries: SongsQueries = Depends()):
    return {"songs": queries.find_all_songs()}


@router.get("/api/songs/{song_id}", response_model=SongOut)
def find_one_song(song_id: str, queries: SongsQueries = Depends()):
    song = queries.find_one_song(song_id=song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="song not found")
    return song


@router.delete(
    "/api/playlists/{playlist_id}/songs/{song_id}", response_model=DeleteStatus
)
def delete_song(
    song_id: str,
    playlist_id: str,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongsQueries = Depends(),
):
    return {
        "status": queries.delete(
            song_id=song_id,
            account_id=account_data["id"],
            playlist_id=playlist_id,
        )
    }


@router.put("/api/songs/{song_id}", response_model=SongOut)
def update_song(
    song_id: str,
    song_in: SongIn,
    queries: SongsQueries = Depends(),
):
    song = queries.update(song_id=song_id, song_changes=song_in)

    if song is None:
        raise HTTPException(status_code=404, detail="song not Found")
    return song


@router.post("/api/playlists/{playlist_id}/songs", response_model=SongOut)
def create(
    playlist_id: str,
    song_in: SongIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongsQueries = Depends(),
):
    return queries.create(
        playlist_id=playlist_id, song_in=song_in, account_id=account_data["id"]
    )


@router.get("/api/playlists/{playlist_id}/songs", response_model=Songs)
def songs_in_playlist(
    playlist_id: str,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongsQueries = Depends(),
):
    return queries.songs_in_playlist(
        playlist_id=playlist_id, account_id=account_data["id"]
    )


@router.put("/api/playlists/{playlist_id}/songdown/{idx}")
def move_song_down(
    playlist_id: str,
    idx: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongsQueries = Depends(),
):
    result = queries.move_down(
        playlist_id=playlist_id, account_id=account_data["id"], idx=idx
    )
    return result


@router.put("/api/playlists/{playlist_id}/songup/{idx}")
def move_song_up(
    playlist_id: str,
    idx: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongsQueries = Depends(),
):
    result = queries.move_up(
        playlist_id=playlist_id, account_id=account_data["id"], idx=idx
    )
    return result
