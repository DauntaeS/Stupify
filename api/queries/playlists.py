from pymongo import MongoClient
from models import PlayListIn
import os
from bson.objectid import ObjectId
from bson.errors import InvalidId


DATABASE_URL = os.environ.get("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["mongo-db"]


class PlayListQueries:
    @property
    def collection(self):
        return db["playlists-db"]

    def create_playlist(self, playlist_in: PlayListIn, account_id: str):
        playlist = playlist_in.dict()
        playlist["account_id"] = account_id
        existing_playlists_count = self.collection.count_documents({})
        playlist["idx"] = existing_playlists_count - 1
        self.collection.insert_one(playlist)
        playlist["id"] = str(playlist["_id"])

        return playlist

    def move_down(self, account_id: str, idx: int):
        playlists = self.find_all(account_id=account_id)

        for index, item in enumerate(playlists):
            item["idx"] = index

        original = playlists[idx]
        del original["_id"]
        target = playlists[idx + 1]
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

    def move_up(self, account_id: str, idx: int):
        playlists = self.find_all(account_id=account_id)

        for index, item in enumerate(playlists):
            item["idx"] = index

        original = playlists[idx]
        del original["_id"]
        target = playlists[idx - 1]
        del target["_id"]

        self.collection.update_one(
            {"_id": ObjectId(original["id"]), "account_id": account_id},
            {"$set": target},
        )
        self.collection.update_one(
            {"_id": ObjectId(target["id"]), "account_id": account_id},
            {"$set": original},
        )
        return {"message": "Moved Up"}

    def find_all(self, account_id: str):
        results = []
        final = []
        for playlist in self.collection.find():
            playlist["id"] = str(playlist["_id"])
            results.append(playlist)
        for account_playlist in results:
            if (
                "account_id" in account_playlist
                and account_playlist["account_id"] == account_id
            ):
                final.append(account_playlist)

        return final

    def find_one(self, playlist_id: str, account_id: str):
        try:
            playlist = self.collection.find_one(
                {"_id": ObjectId(playlist_id), "account_id": account_id}
            )

        except InvalidId:
            return None
        if playlist is None:
            return playlist

        playlist["id"] = str(playlist["_id"])

        return playlist

    def delete(self, playlist_id: str, account_id: str):
        result = self.collection.delete_one(
            {"_id": ObjectId(playlist_id), "account_id": account_id}
        )
        return result.deleted_count > 0

    def update(
        self, playlist_id: str, playlist_changes: PlayListIn, account_id: str
    ):
        playlist = playlist_changes.dict()
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(playlist_id), "account_id": account_id},
                {"$set": playlist},
            )

        except InvalidId:
            return None
        if result.matched_count == 0:
            return None
        playlist["id"] = playlist_id
        playlist["account_id"] = account_id
        return playlist
