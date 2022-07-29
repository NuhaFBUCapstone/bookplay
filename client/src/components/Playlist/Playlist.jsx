import * as React from "react"
import "./Playlist.css"
import { useState, useEffect } from "react"
import axios from "axios"
import SpotifyCard from "../SpotifyCard/SpotifyCard"
import ReactLoading from "react-loading"

export default function Playlist() {
    const CLIENT_ID = "fa34a9f8d466460dbc82e1eddeb37765"
    const REDIRECT_URI = "http://localhost:3000/playlist"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [search, setSearch] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

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
      }

      async function getRecs() {
        if (!search) return
        setResults([])
        setLoading(true)
        try {
            const response = await axios.post(`http://localhost:3001/playlist/search/${search}`, {
                "token": token
            })
            setResults(response.data.tracks)
            console.log(response.data.tracks)
        } catch (err) {
            alert("Couldn't get songs.")
        }
        setLoading(false)
      }



      return (
        <div className="playlist">
            <div className={token? "hidden" : "sp-log-in"}>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                Click here to log in to Spotify</a>
            </div>
            <div className={token? "sp-log-out" : "hidden"} onClick={logOut}>Log Out of Spotify</div>
            <div className="side">
                <form className={token? "search": "hidden"}>
                    <input className="sp-bar" type="text" onChange={e => setSearch(e.target.value)}/>
                    <input className="sp-btn" onClick={getRecs} type="submit" value="search"/>
                    <input className="sp-clear" type="reset" value="clear" onClick={() => {setSearch(""); setResults([])}}/>
                </form>
            </div>
            <div className={token ? "playlist-cards" : "hidden"}>
                <ReactLoading className={loading ? "bars" : "hidden"} type="bars" color="#539" height={65 + "px"}/>
                <div className={loading ? "gen-playlist" : "hidden"}>Generating Playlist</div>    
                <div className="sp-grid">            
                {results.map((r, idx) => {
                    return <SpotifyCard song={r} key={idx}/>
                })}</div>
            </div>
        </div>
    )
}