import os
import base64
from requests import post, get
import json
import random

client_id = os.environ.get("CLIENT_ID")
client_secret = os.environ.get("CLIENT_SECRET")


class SpotifyQueries:
    @property
    def get_token(self):
        auth_string = f"{client_id}:{client_secret}"
        auth_bytes = auth_string.encode("utf-8")
        auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

        url = "https://accounts.spotify.com/api/token"
        headers = {
            "Authorization": "Basic " + auth_base64,
            "Content-Type": "application/x-www-form-urlencoded",
        }

        data = {"grant_type": "client_credentials"}
        result = post(url, headers=headers, data=data)

        json_result = json.loads(result.content)

        token = json_result["access_token"]

        return token

    @property
    def get_auth_header(self):
        return {"Authorization": "Bearer " + self.get_token}

    def search(self, s, o, lim):
        url = "https://api.spotify.com/v1/search"
        headers = self.get_auth_header

        q = f"?q={s}&type=artist,album,track&offset={o}&limit={lim}"

        query_url = url + q

        result = get(query_url, headers=headers)

        json_result = json.loads(result.content)

        albums_info = []
        for album in json_result["albums"]["items"]:
            album_info = {}
            album_info["id"] = album["id"]
            album_info["name"] = album["name"]
            album_info["image"] = album["images"][0]["url"]
            album_info["release_date"] = album["release_date"]
            album_info["total_tracks"] = album["total_tracks"]
            album_info["types"] = album["type"]
            albums_info.append(album_info)
        tracks_info = []
        track_artists_info = []
        for i in range(len(json_result["tracks"]["items"])):
            artist_list = []
            for artist in json_result["tracks"]["items"][i]["artists"]:
                track_artists_name = {}
                track_artists_name["artist_name"] = artist["name"]
                track_artists_name["id"] = artist["id"]
                artist_list.append(track_artists_name)
            track_artists_info.append(artist_list)
        i = 0
        for track in json_result["tracks"]["items"]:
            track_info = {}
            track_info["id"] = track["id"]
            track_info["name"] = track["name"]
            track_info["album_name"] = track["album"]["name"]
            track_info["album_image"] = track["album"]["images"][0]["url"]
            track_info["album_id"] = track["album"]["id"]
            track_info["preview_url"] = track["preview_url"]
            track_info["duration_ms"] = track["duration_ms"]
            track_info["disc_number"] = track["disc_number"]
            track_info["track_number"] = track["track_number"]
            track_info["artist_name"] = track_artists_info[i]
            i += 1
            tracks_info.append(track_info)

        artists_info = []

        for artist in json_result["artists"]["items"]:
            artist_info = {}
            artist_info["name"] = artist["name"]
            artist_info["id"] = artist["id"]
            try:
                artist_info["artist_image"] = artist["images"][0]["url"]
            except IndexError:
                artist_info["artist_image"] = "http://bit.ly/3Pd8P8k"
            artist_info["types"] = artist["type"]
            artists_info.append(artist_info)

        if len(json_result) == 0:
            return None

        return [
            {"artists_info": artists_info},
            {"tracks_info": tracks_info},
            {"albums_info": albums_info},
        ]

    def get_artist_info(self, id: str):
        headers = self.get_auth_header
        artist_info = f"https://api.spotify.com/v1/artists/{id}"
        top_tracks = f"https://api.spotify.com/v1/artists/{id}/top-tracks"
        artist_albums = f"https://api.spotify.com/v1/artists/{id}/albums"
        artist_info = get(artist_info, headers=headers)
        json_info = json.loads(artist_info.content)

        params = {"market": "US"}
        top_tracks_info = get(top_tracks, params=params, headers=headers)
        json_top_tracks = json.loads(top_tracks_info.content)

        albums = get(artist_albums, headers=headers)
        json_albums = json.loads(albums.content)

        artist_info = []
        artist_dict = {}
        artist_dict["id"] = json_info["id"]
        artist_dict["name"] = json_info["name"]
        artist_dict["type"] = json_info["type"]
        try:
            artist_dict["image"] = json_info["images"][0]["url"]
        except IndexError:
            artist_dict["artist_image"] = "http://bit.ly/3Pd8P8k"
        artist_info.append(artist_dict)

        top_tracks_info = []
        track_artists_info = []
        for i in range(len(json_top_tracks["tracks"])):
            artist_list = []
            for artist in json_top_tracks["tracks"][i]["artists"]:
                track_artists_name = {}
                track_artists_name["artist_name"] = artist["name"]
                track_artists_name["id"] = artist["id"]
                artist_list.append(track_artists_name)
            track_artists_info.append(artist_list)

        i = 0
        for track in json_top_tracks["tracks"]:
            track_info = {}
            track_info["id"] = track["id"]
            track_info["name"] = track["name"]
            track_info["album_id"] = track["album"]["id"]
            track_info["album_name"] = track["album"]["name"]
            track_info["album_image"] = track["album"]["images"][0]["url"]
            track_info["preview_url"] = track["preview_url"]
            track_info["duration_ms"] = track["duration_ms"]
            track_info["track_number"] = track["track_number"]
            track_info["artist_name"] = track_artists_info[i]
            i += 1
            top_tracks_info.append(track_info)

        albums_info = []
        for album in json_albums["items"]:
            album_info = {}
            album_info["id"] = album["id"]
            album_info["name"] = album["name"]
            album_info["image"] = album["images"][0]["url"]
            album_info["release_date"] = album["release_date"]
            album_info["total_tracks"] = album["total_tracks"]
            album_info["types"] = album["type"]
            albums_info.append(album_info)

        return {
            "artist_info": artist_info,
            "top_tracks_info": top_tracks_info,
            "albums_info": albums_info,
        }

    def get_album_info(self, id: str):
        headers = self.get_auth_header
        album_info = f"https://api.spotify.com/v1/albums/{id}"
        result = get(album_info, headers=headers)
        json_result = json.loads(result.content)

        tracks_info = []
        track_artists_info = []
        album_info = {}
        artist_info = []
        for artist in json_result["artists"]:
            artist_dict = {}
            artist_dict["name"] = artist["name"]
            artist_dict["id"] = artist["id"]
            artist_info.append(artist_dict)

        album_info["name"] = json_result["name"]
        album_info["artists"] = artist_info
        album_info["id"] = json_result["id"]
        album_info["image"] = json_result["images"][0]["url"]
        album_info["release_date"] = json_result["release_date"]
        album_info["total_tracks"] = json_result["total_tracks"]

        for i in range(len(json_result["tracks"]["items"])):
            artist_list = []
            for artist in json_result["tracks"]["items"][i]["artists"]:
                track_artists_name = {}
                track_artists_name["artist_name"] = artist["name"]
                track_artists_name["id"] = artist["id"]
                artist_list.append(track_artists_name)
            track_artists_info.append(artist_list)
        i = 0
        for track in json_result["tracks"]["items"]:
            track_info = {}
            track_info["id"] = track["id"]
            track_info["name"] = track["name"]
            track_info["preview_url"] = track["preview_url"]
            track_info["duration_ms"] = track["duration_ms"]
            track_info["track_number"] = track["track_number"]
            track_info["artist_name"] = track_artists_info[i]
            i += 1
            tracks_info.append(track_info)

        return {"album_info": album_info, "tracks": tracks_info}

    def get_track_info(self, id: str):
        headers = self.get_auth_header
        track_info = f"https://api.spotify.com/v1/tracks/{id}"
        result = get(track_info, headers=headers)
        json_result = json.loads(result.content)

        tracks_info = []
        artists = []
        album_info = {}
        album_info["name"] = json_result["album"]["name"]
        album_info["id"] = json_result["album"]["id"]
        album_info["image"] = json_result["album"]["images"][0]["url"]

        if len(json_result["artists"]) > 1:
            for artist in json_result["artists"]:
                artist_dict = {}
                artist_dict["artist_name"] = artist["name"]
                artist_dict["id"] = artist["id"]
                artists.append(artist_dict)
        else:
            artist_dict = {}
            artist_dict["artist_name"] = json_result["artists"][0]["name"]
            artist_dict["id"] = json_result["artists"][0]["id"]
            artists.append(artist_dict)

        track_info = {}
        track_info["id"] = json_result["id"]
        track_info["name"] = json_result["name"]
        track_info["duration_ms"] = json_result["duration_ms"]
        track_info["track_number"] = json_result["track_number"]
        track_info["artist_name"] = artists
        tracks_info.append(track_info)

        return {"album_info": album_info, "track_info": track_info}

    def get_genre(self):
        u = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
        headers = self.get_auth_header
        result = get(u, headers=headers)
        json_result = json.loads(result.content)
        if len(json_result) == 0:
            return None
        return json_result

    def get_recommendation(self, genre, artist):
        headers = self.get_auth_header

        url = "https://api.spotify.com/v1/recommendations"

        search_url = "https://api.spotify.com/v1/search"

        query = f"?q={artist}&type=artist&limit=1"

        query_url = search_url + query

        result = get(query_url, headers=headers)

        artist_result = json.loads(result.content)

        artist_id = artist_result["artists"]["items"][0]["id"]

        params = {
            "limit": 5,
            "seeded_genres": genre,
            "seed_artists": artist_id,
        }

        result = get(url, params=params, headers=headers)
        json_result = json.loads(result.content)

        if len(json_result) == 0:
            return None

        tracks_info = []
        track_artists_info = []
        for i in range(len(json_result["tracks"])):
            artist_list = []
            for artist in json_result["tracks"][i]["artists"]:
                track_artists_name = {}
                track_artists_name["artist_name"] = artist["name"]
                track_artists_name["id"] = artist["id"]
                artist_list.append(track_artists_name)
            track_artists_info.append(artist_list)
        i = 0
        for track in json_result["tracks"]:
            track_info = {}
            track_info["id"] = track["id"]
            track_info["name"] = track["name"]
            track_info["preview_url"] = track["preview_url"]
            track_info["duration_ms"] = track["duration_ms"]
            track_info["track_number"] = track["track_number"]
            track_info["album_name"] = track["album"]["name"]
            track_info["album_id"] = track["album"]["id"]
            track_info["image"] = track["album"]["images"][0]["url"]
            track_info["artist_name"] = track_artists_info[i]
            i += 1
            tracks_info.append(track_info)

        return tracks_info

    def genre_search(self, search, limit):
        url = "https://api.spotify.com/v1/search"
        headers = self.get_auth_header
        query = f"?q=genre:{search}&type=artist&limit={limit}"
        query_url = url + query

        result = get(query_url, headers=headers)

        json_result = json.loads(result.content)

        artists_info = []

        for artist in json_result["artists"]["items"]:
            artist_info = {}
            artist_info["name"] = artist["name"]
            artist_info["id"] = artist["id"]
            artist_info["artist_image"] = artist["images"][0]["url"]
            artist_info["types"] = artist["type"]
            artists_info.append(artist_info)

        if len(json_result) == 0:
            return None

        return artists_info

    def random_artist_genre(self):
        list_of_genre = self.get_genre()
        random_index = random.randint(0, len(list_of_genre["genres"]))
        random_genre = list_of_genre["genres"][random_index]
        result = self.genre_search(random_genre, 1)
        return result

    def get_random(self):
        search_query_patterns = [
            "%25a%25",
            "a%25",
            "%25e%25",
            "e%25",
            "%25i%25",
            "i%25",
            "%25o%25",
            "o%25",
            "%25u%25",
            "u%25",
        ]

        rando_search_query = random.choice(search_query_patterns)

        total_tracks = 500
        rand_off = random.randint(0, total_tracks)

        url = "https://api.spotify.com/v1/search"

        query = f"?q={rando_search_query}&type=track&offset={rand_off}&limit=1"
        rick_roll = "https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT"
        header = self.get_auth_header

        query_url = url + query
        rick_roll = rick_roll + query

        rick_roll_or_not = random.randint(0, 5)
        if rick_roll_or_not == 0:
            response = get(rick_roll, headers=header)
            data = json.loads(response.content)
            return {"rickrolld": "You've been Rick Roll'd"}
        else:
            response = get(query_url, headers=header)
            data = json.loads(response.content)

        if (
            "tracks" in data
            and "items" in data["tracks"]
            and len(data["tracks"]["items"]) > 0
        ):
            random_track = data["tracks"]["items"][0]
            track_name = random_track["name"]
            artist_name = random_track["artists"][0]["name"]
            artist_id = random_track["artists"][0]["id"]
            album_name = random_track["album"]["name"]
            album_id = random_track["album"]["id"]
            album_image = random_track["album"]["images"][0]["url"]
            track_id = data["tracks"]["items"][0]["id"]

            return {
                "track_name": track_name,
                "artist_name": artist_name,
                "artist_id": artist_id,
                "album_name": album_name,
                "album_id": album_id,
                "album_image": album_image,
                "track_id": track_id,
            }
        else:
            return {"message": "No random track found."}
