from fastapi.testclient import TestClient
from main import app
from queries.songs import SongsQueries

client = TestClient(app)


class FakeSongsQueries:
    def find_all_songs(self, q: str | None = None):
        return [
            {
                "name": "Song_1",
                "id": "64e7b077cb5c3ec61015fede",
                "account_id": "64e4ef1601c3eedf1445f385",
            }
        ]

    def find_one_song(self, song_id: str):
        return {
            "name": "thot",
            "id": "64e788ba4cc68c893e307aed",
            "account_id": "64e4ef1601c3eedf1445f386",
        }


def test_find_all_songs():
    app.dependency_overrides[SongsQueries] = FakeSongsQueries
    res = client.get("/api/songs")
    data = res.json()

    assert res.status_code == 200
    assert data == {
        "songs": [
            {
                "name": "Song_1",
                "id": "64e7b077cb5c3ec61015fede",
                "account_id": "64e4ef1601c3eedf1445f385",
            }
        ]
    }


def test_find_one_song():
    app.dependency_overrides[SongsQueries] = FakeSongsQueries
    res = client.get("/api/songs/Drake")
    data = res.json()

    assert res.status_code == 200
    assert data == {
        "name": "thot",
        "id": "64e788ba4cc68c893e307aed",
        "account_id": "64e4ef1601c3eedf1445f386",
    }
