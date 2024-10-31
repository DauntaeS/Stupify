from fastapi import APIRouter, Depends
from queries.spotify import SpotifyQueries


router = APIRouter()


@router.get("/api/spotify/")
def search(
    s: str,
    o: int = 0,
    lim: int = 4,
    queries: SpotifyQueries = Depends(),
):
    return [queries.search(s, o, lim)]


@router.get("/api/spotify/genres")
def genre_search(
    search: str,
    limit: int = 10,
    queries: SpotifyQueries = Depends(),
):
    return [queries.genre_search(search, limit)]


@router.get("/api/spotify/allgenres")
def get_genre(
    queries: SpotifyQueries = Depends(),
):
    return [queries.get_genre()]


@router.get("/api/spotify/artists/{id}")
def get_artist_info(
    id: str,
    queries: SpotifyQueries = Depends(),
):
    return [queries.get_artist_info(id)]


@router.get("/api/spotify/albums/{id}")
def get_album_info(
    id: str,
    queries: SpotifyQueries = Depends(),
):
    return [queries.get_album_info(id)]


@router.get("/api/spotify/tracks/{id}")
def get_track_info(
    id: str,
    queries: SpotifyQueries = Depends(),
):
    return [queries.get_track_info(id)]


@router.get("/api/spotify/recommendations")
def get_recommendation(
    genre: str,
    artist: str,
    queries: SpotifyQueries = Depends(),
):
    return [queries.get_recommendation(genre, artist)]


@router.get("/api/spotify/random")
def get_random(
    queries: SpotifyQueries = Depends(),
):
    return queries.get_random()


@router.get("/api/spotify/randomartists")
def random_artist_genre(
    queries: SpotifyQueries = Depends(),
):
    return queries.random_artist_genre()
