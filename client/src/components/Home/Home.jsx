import * as React from "react"
import "./Home.css"
import {Link} from "react-router-dom"
import axios from "axios"
import { useState, useEffect } from "react"
import img from './refresh.png'

export default function Home({sessionToken, recs}) {
    const [recents, setRecents] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState({})
    const [pending, setPending] = useState([])

    async function getUsers() {
        if (!searchTerm) return 
        const response = await axios.get(`http://localhost:3001/friends/users/${searchTerm}`)
        setResults(response.data)
    }

    async function sendRequest(e) {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3001/friends/send/${sessionToken}`, {
                "friend": results
            })
        } catch (err) {
            alert(err)
        }
    }
    async function seeRequests(e) {
        e.preventDefault()
        try {
            const response = await axios.get(`http://localhost:3001/friends/seeReqs/${sessionToken}`, {
                "friend": results
            })
            setPending(response.data)
        } catch (err) {
            alert(err)
        }
    }
    async function acceptReq(e, name) {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3001/friends/accept/${name}`, {
                "sessionToken": sessionToken
            })
            console.log(response)
        } catch (err) {
            alert(err)
        }
    }


    async function getRecent() {
        try {
            const recentResponse = await axios.get(`http://localhost:3001/books/recent/${sessionToken}`)
            setRecents(recentResponse.data)
        }
        catch (err) {
            alert("Couldn't load recent activity.")
        }
    }
    useEffect(() => {
        {if (sessionToken!==null) getRecent()}
      },[])

    return (
        <div className="home">
            <div className={sessionToken===null ? "logged-out-home" : "hidden"}>
                <p>Must login to view this page</p>
                <Link to="/">Click to login</Link>
            </div>
            <div className={sessionToken===null ? "hidden" : "logged-in-home"}>
                <div className="recents-title">
                <h2>Recent Activity</h2>
                <div className="recents-outer">
                {recents.map(b => {
                    return <div className="recents" key={b.objectId}>
                        <Link to={`/book/${b.bookId}`}><img className="recents-image" src={b.image}/><br/></Link>
                        {b.title}<br/>
                        Saved on: {new Date(Date.parse(b.createdAt)).toLocaleDateString()}
                        </div>
                })}
                </div></div><br/>
                <div className="recents-title">
                <h2>Recommendations</h2>
                <p>People who read books you liked also read: </p>
                <div className="recents-outer">
                    {recs?.map(b => {
                        return <div className="recents" key={b.objectId}>
                            <Link to={`/book/${b.bookId}`}><img className="recents-image" src={b.image}/><br/></Link>
                            {b.title}<br/>
                        </div>
                    })}
                </div></div>
                <div className="friends">
                    <form className="search-friends">
                        <label htmlFor="search">Find friends: </label>
                        <input type="text" id="search" placeholder="search by username..." 
                            onChange={(e) => {setSearchTerm(e.target.value)}}>
                        </input>
                        <input type="submit" value="search" onClick={(e) => {e.preventDefault(); getUsers()}}/>
                        <input type="reset" value="clear" onClick={(e) => {setSearchTerm(""); setResults({})}}></input>
                        <br/><br/>
                        <div className={Object.keys(results).length===0 ? "no-res" : "hidden"}>No Results Found</div>
                        <div className={Object.keys(results).length!==0 ? "res" : "hidden"}>
                            {results.username}, joined on {new Date(Date.parse(results.createdAt)).toLocaleDateString()}
                            <button onClick={(e) => sendRequest(e)}>send friend request</button>
                        </div>
                    
                    </form>
                    <div className="requests">
                        Your friend requests:
                        <button className="refresh" onClick={(e) => {seeRequests(e)}}><img src={img}/></button>
                        {pending?.map(r => {
                            return <div className="request-names" key={r.objectId}>{r.fromName} 
                            <button onClick={(e) => acceptReq(e, r.fromName)}>Accept</button>
                            <button>Reject</button>
                            </div>
                        })}
                    </div>
                </div>
            </div>            
        </div>
    )
}