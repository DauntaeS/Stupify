from pymongo import MongoClient
from models import SongIn
import os
from bson.objectid import ObjectId
from bson.errors import InvalidId


DATABASE_URL = os.environ.get("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["mongo-db"]

client_id = os.environ.get("CLIENT_ID")
client_secret = os.environ.get("CLIENT_SECRET")


class SongsQueries:
    @property
    def collection(self):
        return db["songs-db"]

    def create(self, playlist_id: str, song_in: SongIn, account_id: str):
        song = song_in.dict()
        song["playlist_id"] = playlist_id
        song["account_id"] = account_id
        song["idx"] = 0
        self.collection.insert_one(song)
        song["id"] = str(song["_id"])
        return song

    def find_all_songs(self):
        results = []
        for song in self.collection.find():
            song["id"] = str(song["_id"])
            results.append(song)
        return results

    def find_one_song(self, song_id: str):
        try:
            song = self.collection.find_one({"_id": ObjectId(song_id)})

        except InvalidId:
            return None
        if song is None:
            return song

        song["id"] = str(song["_id"])

        return song

    def delete(self, song_id: str, account_id: str, playlist_id: str):
        result = self.collection.delete_one(
            {
                "_id": ObjectId(song_id),
                "account_id": account_id,
                "playlist_id": playlist_id,
            }
        )
        return result.deleted_count > 0

    def update(self, song_id: str, song_changes: SongIn):
        song = song_changes.dict()
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(song_id)}, {"$set": song}
            )
        except InvalidId:
            return None
        if result.matched_count == 0:
            return None
        song["id"] = song_id
        return song

    def songs_in_playlist(self, playlist_id: str, account_id: str):
        results = []
        for song in self.collection.find({"playlist_id": playlist_id}):
            song["id"] = str(song["_id"])
            song["account_id"] = account_id
            results.append(song)
        return {"songs": results}

    def move_down(self, playlist_id: str, account_id: str, idx: int):
        songs = self.songs_in_playlist(
            playlist_id=playlist_id, account_id=account_id
        )
        if len(songs["songs"]) < 2:
            return {"message": "not enough songs"}
        else:
            for index, song in enumerate(songs["songs"]):
                song["idx"] = str(index)

            original = songs["songs"][idx]
            del original["_id"]
            target = songs["songs"][idx + 1]
            del target["_id"]

            self.collection.update_one(
                {"_id": ObjectId(original["id"]), "account_id": account_id},
                {"$set": target},
            )
            self.collection.update_one(
                {"_id": ObjectId(target["id"]), "account_id": account_id},
                {"$set": original},
            )
            return {"message": "Moved down"}

    def move_up(self, playlist_id: str, account_id: str, idx: int):
        songs = self.songs_in_playlist(
            playlist_id=playlist_id, account_id=account_id
        )
        if len(songs["songs"]) < 2:
            return {"message": "not enough songs"}
        else:
            for index, song in enumerate(songs["songs"]):
                song["idx"] = str(index)

            original = songs["songs"][idx]
            del original["_id"]
            target = songs["songs"][idx - 1]
            del target["_id"]

            self.collection.update_one(
                {"_id": ObjectId(original["id"]), "account_id": account_id},
                {"$set": target},
            )
            self.collection.update_one(
                {"_id": ObjectId(target["id"]), "account_id": account_id},
                {"$set": original},
            )
            return {"message": "Moved up"}
