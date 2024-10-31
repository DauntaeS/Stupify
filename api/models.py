from pydantic import BaseModel
from jwtdown_fastapi.authentication import Token
from typing import List, Optional


class AccountForm(BaseModel):
    username: str
    password: str


class AccountIn(BaseModel):
    username: str
    password: str


class AccountOut(BaseModel):
    id: str
    username: str


class AccountOutWithHashedPassword(AccountOut):
    hashed_password: str


class AccountToken(Token):
    account: AccountOut


class SongIn(BaseModel):
    spotify_id: str
    name: str
    artist: List
    album: str
    album_id: str
    album_image: str
    track_number: str
    duration: str


class SongOut(SongIn):
    id: str
    idx: str = None
    none: Optional[str]
    account_id: str = None


class Songs(BaseModel):
    songs: List[SongOut]


class PlayListIn(BaseModel):
    name: str


class PlayListOut(PlayListIn):
    id: str
    idx: str = None
    account_id: str = None


class PlayListSongOut(PlayListIn):
    id: str
    songs: List[SongOut] = None


class PlayLists(BaseModel):
    playlists: List[PlayListOut]


class DeleteStatus(BaseModel):
    status: bool
