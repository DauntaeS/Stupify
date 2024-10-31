import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./Nav.js";
import HomePage from "./HomePage.js";
import LoginPage from "./LoginPage.js";
import SignupPage from "./SignupPage.js";
import AllPlaylist from "./AllPlaylist.js";
import SpotifyRandom from "./SpotifyRandom.js";
import PlayListPage from "./PlayListPage.js";
import GetAllGenres from "./GetAllGenres.js";
import ArtistPage from "./ArtistPage.js";
import AlbumInfo from "./AlbumInfo.js";
import SongInfo from "./SongInfo.js";
import GenreArtists from "./GenreArtists.js";
import RecommendationPage from "./RecommendationPage.js";
import SearchPage from "./SearchPage.js";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
          </Route>
          <Route path="allplaylist">
            <Route index element={<AllPlaylist />} />
          </Route>
          <Route path="playlist/:id/songs" element={<PlayListPage />} />
          <Route path="/spotify/artists">
            <Route index element={<ArtistPage />} />
            <Route path=":id" element={<ArtistPage />} />
          </Route>
          <Route path="/spotify/albums">
            <Route index element={<AlbumInfo />} />
            <Route path=":id" element={<AlbumInfo />} />
          </Route>
          <Route path="/spotify/tracks">
            <Route index element={<SongInfo />} />
            <Route path=":id" element={<SongInfo />} />
          </Route>
          <Route path="search">
            <Route index element={<SearchPage />} />
          </Route>
          <Route path="/spotify/allgenres">
            <Route index element={<GetAllGenres />} />
          </Route>
          <Route path="/spotify/genres">
            <Route index element={<GenreArtists />} />
          </Route>
          <Route path="/spotify/recommendations">
            <Route index element={<RecommendationPage />} />
          </Route>
          <Route path="/spotify/random">
            <Route index element={<SpotifyRandom />} />
          </Route>
          <Route path="homePage">
            <Route index element={<HomePage />} />
          </Route>
          <Route path="loginPage">
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="signupPage">
            <Route index element={<SignupPage />} />
          </Route>
          <Route path="signupPage/homePage" component={AllPlaylist}>
            <Route index element={<AllPlaylist />} />
          </Route>
          <Route path="/loginPage/allplaylist" component={AllPlaylist}>
            <Route index element={<AllPlaylist />} />
          </Route>
          <Route path="/homePage/loginpage" component={LoginPage}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/homePage/loginpage/allplaylist" component={AllPlaylist}>
            <Route index element={<AllPlaylist />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
