from fastapi.testclient import TestClient
from main import app
from queries.playlists import PlayListQueries
from models import PlayListIn
from authenticator import authenticator

client = TestClient(app)


def fake_get_current_account_data():
    return {"id": "64ee2e9b589daea6d87bb26c", "username": "string"}


class FakePlayListQueries:
    def create_playlist(self, playlist_in: PlayListIn, account_id: str):
        playlist = playlist_in.dict()
        playlist["account_id"] = account_id
        playlist["id"] = "64ee2edf589daea6d87bb26d"
        return playlist

    def find_all(self, account_id: str):
        return [
            {
                "name": "string",
                "id": "64ee52752d5726e49347900a",
                "account_id": "64dd327080fa070a982d21f0",
            }
        ]


def test_create_playlist():
    app.dependency_overrides[PlayListQueries] = FakePlayListQueries
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    body = {"name": "string"}
    res = client.post("/api/playlists", json=body)
    data = res.json()

    assert res.status_code == 200
    assert data == {
        "name": "string",
        "id": "64ee2edf589daea6d87bb26d",
        "account_id": "64ee2e9b589daea6d87bb26c",
    }


def test_find_all_playlists():
    app.dependency_overrides[PlayListQueries] = FakePlayListQueries
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    res = client.get("/api/playlists")
    data = res.json()

    assert res.status_code == 200
    assert data == {
        "playlists": [
            {
                "name": "string",
                "id": "64ee52752d5726e49347900a",
                "account_id": "64dd327080fa070a982d21f0",
            }
        ]
    }
