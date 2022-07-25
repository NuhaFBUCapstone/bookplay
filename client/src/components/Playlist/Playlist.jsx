import * as React from "react"
import "./Playlist.css"
import { useState, useEffect } from "react"
import axios from "axios"
import SpotifyCard from "../SpotifyCard/SpotifyCard"

export default function Playlist() {

    //allow for client to search for genre so it can be more specific: like high fantasy, dark romance, etc
    const CLIENT_ID = "fa34a9f8d466460dbc82e1eddeb37765"
    const REDIRECT_URI = "http://localhost:3000/playlist"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    //check token based on localstorage so it stays after refresh
    const [search, setSearch] = useState("")
    const [results, setResults] = useState([])
    useEffect(() => {
        const hash = window.location.hash 
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))
            .split("=")[1]
            window.location.hash = ""
            window.localStorage.setItem("token", token)
            setToken(token)
        }
      },[])    


      const logOut = () => {
        setToken("")
        window.localStorage.removeItem("token")
      }

      async function getRecs() {
        try {
            const response = await axios.get(`http//localhost:3001/playlist/search?${search}`, {
                "token": token
            })
            setResults(response.data.tracks)
        } catch (err) {
            alert("Couldn't get songs.")
        }
        //will return all the songs
        //print out pics, titles
      }



      return (
        <div className="playlist">
            <a className={token? "hidden" : "sp-log-in"} href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                Login to Spotify</a> 
            <button className={token? "sp-log-out" : "hidden"} onClick={logOut}>Logout</button>
            <div className={token? "token": "token hidden"}>
                <form>
                    <input type="text" onChange={e => setSearch(e.target.value)}/>
                    <button onClick={getRecs} type={"submit"}>Submit</button>
                </form>
            </div>
            <div className="search-results">
                {results.map((r, idx) => {
                    return <SpotifyCard song={r} key={idx}/>
                })}
            </div>
            
        </div>
    )
}