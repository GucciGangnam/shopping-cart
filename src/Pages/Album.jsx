// Import Style
import "./Album.css"

// Import Hooks
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"



// Component 

export const Album = ({ accessToken }) => {
    // useParams 
    const { id } = useParams();
    // States 
    const [album, setAlbum] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Format milliseconds into MM:SS:MSMS
    function formatMilliseconds(milliseconds) {
        // Calculate minutes, seconds, and milliseconds
        const totalSeconds = Math.ceil(milliseconds / 1000); // Round up to the nearest second
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const roundedMilliseconds = Math.ceil((milliseconds % 1000) / 10); // Round up to two decimal places

        // Format minutes with or without leading "0"
        const formattedMinutes = (minutes < 10) ? String(minutes) : String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(roundedMilliseconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
    }
    // Fetch Album from Spotify API
    // set album Parameters
    useEffect(() => {
        var albumParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        // Fetch album
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`https://api.spotify.com/v1/albums/${id}?market=GB`, albumParameters
                );
                if (response.ok) {
                    const data = await response.json();
                    setAlbum(data);
                    setLoading(false);
                    console.log(data);
                } else {
                    console.error('Failed to fetch album');
                    // setError(true);
                }
            } catch (error) {
                console.error('Error fetching album:', error);
                setError(true);
            }
        };
        fetchAlbum();
    }, [])

    // Conditional rendering based on loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching album data.</p>;
    }

    // Only render album details if album data is available
    return (
        <div className="Album">

            <div className="AlbumLeftDiv">
                <img className="AlbumAlbumCover" src={album.images[0].url} alt={`Album cover for ${album.name}`} />
                <a href={album.uri} className="TracklistButton">Play in Spotify</a>
            </div>

            <div className="AlbumRightDiv">
                <div className="AlbumRightDivContent">
                    <div className="AlbumName">{album.name}</div>
                    <div className="ArtistName">{album.artists[0].name}</div>
                    <div className="TracklistDiv">
                        {album.tracks.items.map((track) => (
                            <div key={track.id} className="TrackDiv">
                                <div style={{ padding: '5px' }}>{track.name}</div>
                                <div style={{ color: '#ffffff80' }}>{formatMilliseconds(track.duration_ms)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="AddToCartButton">Add to cart</button>
            </div>

        </div>
    );
}