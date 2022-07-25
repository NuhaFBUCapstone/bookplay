import * as React from "react"
import "./Home.css"
import {Link} from "react-router-dom"
import axios from "axios"
import { useState, useEffect } from "react"

export default function Home({sessionToken}) {
    const [recents, setRecents] = useState([])

    async function getRecent() {
        try {
            const recentResponse = await axios.get(`http://localhost:3001/books/recent/${sessionToken}`)
            setRecents(recentResponse.data)
        }
        catch (err) {
            alert("Couldn't load recommendations.")
        }
    }
    useEffect(() => {
        getRecent()
      },[])

    return (
        <div className="home">
            <div className={sessionToken===null ? "logged-out-home" : "hidden"}>
                <p>Must login to view this page</p>
                <Link to="/">Click to login</Link>
            </div>
            <div className={sessionToken===null ? "hidden" : "logged-in-home"}>
                <h2>Recent Activity</h2>
                <div className="recents-outer">
                {recents.map(b => {
                    return <div className="recents" key={b.objectId}>
                        <Link to={`/book/${b.bookId}`}><img className="recents-image" src={b.image}/><br/></Link>
                        {b.title}<br/>
                        Saved on: {new Date(Date.parse(b.createdAt)).toDateString()}
                        </div>
                })}
                </div>
            </div>            
        </div>
    )
}