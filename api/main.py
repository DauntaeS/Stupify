from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import accounts, playlists, songs, spotify
import os
from authenticator import authenticator


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(accounts.router, tags=["Accounts"])
app.include_router(authenticator.router, tags=["Accounts"])


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }


app.include_router(playlists.router, tags=["Playlist"])
app.include_router(songs.router, tags=["Songs"])
app.include_router(spotify.router, tags=["Spotify"])
