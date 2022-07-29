import * as React from "react"
import "./SpotifyCard.css"

export default function SpotifyCard({song}) {
    return (
        <div className="sp-card">
            {song.name} by {song.artists[0].name}<br/>
            <img className="album-cover" src={song.album.images[0].url}/>
            <br/>
    <iframe className={song.preview_url ? "show" : "hidden"}
        height="85"
        src={song.preview_url}>
    </iframe>
        </div>
    )
}