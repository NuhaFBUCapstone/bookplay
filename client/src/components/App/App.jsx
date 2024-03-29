import * as React from "react"
import axios from "axios"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { useState, useEffect } from "react"
import BookGrid from "../BookGrid/BookGrid"
import NavBar from "../NavBar/NavBar"
import BookDetail from "../BookDetail/BookDetail"
import Library from "../Library/Library"
import Playlist from "../Playlist/Playlist"
import LoggedOut from "../LoggedOut/LoggedOut"
import Home from "../Home/Home"
import NotFound from "../NotFound/NotFound"

export default function App() {
    const [sessionToken, setSessionToken] = useState(localStorage.getItem('sessionToken'))
    const [trends, setTrends] = useState([])
    const [fetching, setFetching] = useState(false)
    const [lists, setLists] = useState([])
    const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("token"))
 
    /**
     * get trending books for landing page
     */
    async function getTrending() {
        setFetching(true)
        const response = await axios.get(`https://openlibrary.org/trending/daily.json`)
        setTrends(response.data.works.slice(0, 7))
        setFetching(false)
    }
    useEffect(() => {
        getTrending()
      },[])

    return (
        <div className="app">
            <BrowserRouter>
            <NavBar sessionToken={sessionToken} setSessionToken={setSessionToken} spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken}/>
            <Routes>
                <Route path="/" element={<LoggedOut lists={lists} setLists={setLists} trends={trends} fetching={fetching} 
                sessionToken={sessionToken} setSessionToken={setSessionToken}/>}/>
                <Route path="/home" element={<Home sessionToken={sessionToken} />}/>
                <Route path="/search" element={<BookGrid sessionToken={sessionToken}/>}/>
                <Route path="/book/:id" element={<BookDetail sessionToken={sessionToken} lists={lists}/>}/>
                <Route path="/library" element={<Library lists={lists} setLists={setLists} sessionToken={sessionToken} />}/>
                <Route path="/playlist" element={<Playlist sessionToken={sessionToken} token={spotifyToken} setToken={setSpotifyToken}/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            </BrowserRouter>
        </div>
    )
}