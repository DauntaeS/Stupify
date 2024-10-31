import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stupifyApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_HOST,
  }),
  tagTypes: ["playlist", "songs"],
  endpoints: (builder) => ({
    getAllPlaylist: builder.query({
      query: () => ({
        url: "/api/playlists",
        credentials: "include",
      }),
      providesTags: ["playlist"],
    }),
    createPlaylist: builder.mutation({
      query: (data) => ({
        url: "/api/playlists/",
        body: data,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["playlist"],
    }),
    getSpecificPlaylist: builder.query({
      query: (playlist_id) => ({
        url: `/api/playlists/${playlist_id}`,
        credentials: "include",
      }),
      providesTags: ["playlist"],
    }),
    deletePlaylist: builder.mutation({
      query: (playlist_id) => ({
        url: `/api/playlists/${playlist_id}`,
        method: "delete",
        credentials: "include",
      }),
      invalidatesTags: ["playlist"],
    }),
    updatePlaylist: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/playlists/${id}`,
        body: data,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["playlist", "songs"],
    }),
    deleteSong: builder.mutation({
      query: ({ sId, pId }) => ({
        url: `/api/playlists/${pId}/songs/${sId}`,
        method: "delete",
        credentials: "include",
      }),
      invalidatesTags: ["songs"],
    }),
    getAllSongsInPlaylist: builder.query({
      query: (id) => ({
        url: `/api/playlists/${id}/songs`,
        credentials: "include",
      }),
      providesTags: ["songs"],
    }),
    createSongInPlaylist: builder.mutation({
      query: (data) => ({
        url: `/api/playlists/${data.playlist_id}/songs`,
        body: data,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["songs", "playlist"],
    }),
    moveSongDown: builder.mutation({
      query: ({pId, idx}) => ({
        url: `/api/playlists/${pId}/songdown/${idx}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["songs"],
    }),
    moveSongUp: builder.mutation({
      query: ({pId, idx}) => ({
        url: `/api/playlists/${pId}/songup/${idx}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["songs"],
    }),
    searchSpotify: builder.query({
      query: (search) => ({
        url: `/api/spotify`,
        params: search,
        method: "GET",
      }),
    }),
    searchSpotifyGenre: builder.query({
      query: (data) => ({
        url: `/api/spotify/genres`,
        params: data,
        method: "GET",
      }),
    }),
    getAllGenre: builder.query({
      query: () => `/api/spotify/allgenres`,
    }),
    getSpotifyArtist: builder.query({
      query: (id) => ({
        url: `/api/spotify/artists/${id}`,
        method: "GET",
      }),
    }),
    getSpotifyAlbum: builder.query({
      query: (data) => ({
        url: `/api/spotify/albums/${data}`,
        method: "GET",
      }),
    }),
    getSpotifyTrack: builder.query({
      query: (data) => ({
        url: `/api/spotify/tracks/${data}`,
        method: "GET",
      }),
    }),
    getSpotifyRecommendations: builder.query({
      query: (data) => ({
        url: `/api/spotify/recommendations/`,
        params: data,
        method: "GET",
      }),
    }),
    getSpotifyRandom: builder.query({
      query: () => `/api/spotify/random`,
    }),
    getSpotifyRandomArtist: builder.query({
      query: () => `/api/spotify/randomartists`,
    }),
    refetchOnMountOrArgChange: 30,
    endpoints: (builder) => ({
      getPosts: builder.query({
        query: () => `posts`,
      }),
    }),
    getToken: builder.query({
      query: () => ({
        url: `/token`,
        credentials: "include",
      }),
      transformResponse: (response) => response?.account || null,
      providesTags: ["Account"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/token`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Account"],
    }),
    login: builder.mutation({
      query: (info) => {
        const formData = new FormData();
        formData.append("username", info.username);
        formData.append("password", info.password);
        return {
          url: "/token",
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["Account"],
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `/api/accounts`,
        body: data,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useGetTokenQuery,
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetAllPlaylistQuery,
  useCreatePlaylistMutation,
  useGetSpecificPlaylistQuery,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeleteSongMutation,
  useGetAllSongsInPlaylistQuery,
  useCreateSongInPlaylistMutation,
  useMoveSongDownMutation,
  useMoveSongUpMutation,
  useSearchSpotifyQuery,
  useLazySearchSpotifyQuery,
  useSearchSpotifyGenreQuery,
  useGetAllGenreQuery,
  useGetSpotifyArtistQuery,
  useGetSpotifyAlbumQuery,
  useGetSpotifyTrackQuery,
  useLazyGetSpotifyRecommendationsQuery,
  useGetSpotifyRandomQuery,
  useGetSpotifyRandomArtistQuery,
} = stupifyApi;
