import { useGetAllSongsInPlaylistQuery } from "./app/apiSlice";

const AllSongsInPlaylist = ({playlist_id}) => {
    const {data}  = useGetAllSongsInPlaylistQuery(playlist_id);

    return <div>{data?.songs.length}</div>
}
export default AllSongsInPlaylist
