import * as React from "react"
import "./Playlist.css"
import { useState, useEffect } from "react"
import axios from "axios"
import SpotifyCard from "../SpotifyCard/SpotifyCard"
import ReactLoading from "react-loading"
import {Link} from "react-router-dom"


export default function Playlist({sessionToken, token, setToken}) {
    const CLIENT_ID = "fa34a9f8d466460dbc82e1eddeb37765"
    const REDIRECT_URI = "http://localhost:3000/playlist"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [search, setSearch] = useState("")
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [bookResults, setBookResults] = useState([])
    const [selectedBook, setSelectedBook] = useState({})
    const [instrumental, setInstrumental] = useState(0.5)
    const [useInstrumental, setUseInstrumental] = useState(false)
    const [message, setMessage] = useState(false)

    useEffect(() => {
        const hash = window.location.hash 
        let token = localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))
            .split("=")[1]
            window.location.hash = ""
            setToken(token)
            localStorage.setItem("token", token)
        }
      },[])    


      const logOut = () => {
        setToken("")
        localStorage.removeItem("token")
        setSongs([])
        setBookResults([])
      }

      async function getRecs(event, book) {
        event.preventDefault();
        if (!search) return
        setSongs([])
        setLoading(true)
        try {
            const response = await axios.post(`http://localhost:3001/playlist/search/${token}`, {
                "book": book, "instrumental": useInstrumental ? instrumental/100 : null
            })
            setSongs(response.data.tracks)
        } catch (err) {
            alert("Couldn't get songs.")
        }
        setLoading(false)
      }

      async function getBooks(e) {
        e.preventDefault();
        if (!search) return
        try {
            const response = await axios.post(`http://localhost:3001/playlist/book/${search}`, {
                "sessionToken": sessionToken
            })
            setBookResults(response.data)
        } catch (err) {
            alert("Couldn't search for books.")
        }
      }
      async function sendToPlaylist(event) {
        event.preventDefault();
        const uris = songs.map(s => {
            return s.uri
        })
        await axios.post(`http://localhost:3001/playlist/create/${token}`, {
            "songs": uris, "title": selectedBook.title
        })
        setMessage(true)
        setTimeout(() => {setMessage(false)}, 1200)
      }

      return (
        <div className="playlist-outer">
            {sessionToken===null ?  
            <div className="logged-out-home">
                <p>Must login to generate playlists</p>
                <Link to="/">Click to login</Link></div> :
        <div className="playlist">
                <div className={token? "hidden" : "sp-log-in"}>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public playlist-modify-private`}>
                Click here to log in to Spotify</a>
            </div>
            <div className={token? "sp-log-out" : "hidden"} onClick={logOut}>Log Out of Spotify</div>
            <div className="sp-show-title">{songs.length===0 ? "" : `Songs related to ${selectedBook.title}:`}</div>

            <div className={songs.length===0 ? "hidden" : "sp-button"}>
                <button onClick={(e) => sendToPlaylist(e)}>Send to Playlist!</button><br/>
                <div className={message ? "message" : "hidden"}>Playlist Created!</div>
            </div>

            <div className="sp-side">
                <form className={token? "search": "hidden"}>
                    <input className="sp-bar" type="text" onChange={e => setSearch(e.target.value)}  placeholder="search for books in your library"/>
                    <input className="sp-btn" onClick={(e) => getBooks(e)} type="submit" value="search"/>
                    <input className="sp-clear" type="reset" value="clear" onClick={() => {setSearch(""); setSongs([]); setBookResults([]); setUseInstrumental(false)}}/>
                    <div onClick={() => setUseInstrumental(!useInstrumental)} className="set-instr">
                        {useInstrumental ? "Click to ignore instrumental filter" : "Click to set instrumental filter"}
                    </div>
                    <input className={useInstrumental ? "range" : "hidden"} type="range" onChange={e => setInstrumental(e.target.value)}/>
                </form>
                <div className="sp-book-grid">
                    {bookResults.map(b => {
                        return <div onClick={(e) => {setSelectedBook(b); getRecs(e, b)}}
                        className="sp-book-card" key={b.objectId}>
                            <img src={b.image}/>
                            <br/>
                            "{b.title}"<br/> on your {b.list} list
                        </div>
                    })}
                </div>
            </div>
            <div className={token ? "playlist-cards" : "hidden"}>
                <ReactLoading className={loading ? "bars" : "hidden"} type="bars" color="#539" height={65 + "px"}/>
                <div className={loading ? "gen-playlist" : "hidden"}>Generating Playlist</div>    
                <div className="sp-grid">            
                {songs.map((r, idx) => {
                    return <SpotifyCard song={r} key={idx}/>
                })}</div>
            </div>
        </div>}
    </div>
    )
}