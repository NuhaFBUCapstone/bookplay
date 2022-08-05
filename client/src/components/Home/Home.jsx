import * as React from "react"
import "./Home.css"
import {Link} from "react-router-dom"
import axios from "axios"
import { useState, useEffect } from "react"
import img from './refresh.png'
import FriendBooks from "../FriendBooks/FriendBooks"
import LiveChat from "../LiveChat/LiveChat"

export default function Home({sessionToken}) {
    const [recents, setRecents] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState({})
    const [pending, setPending] = useState([])
    const [friends, setFriends] = useState({})
    const [isSent, setIsSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [friendBooks, setFriendBooks] = useState([])
    const [selectedFriend, setSelectedFriend] = useState("")
    const [friendLoading, setFriendLoading] = useState(false)
    const [sender, setSender] = useState("")
    const [resultMessage, setResultMessage] = useState("")

    const message = () => {
        setIsSent(true)
        setTimeout(() => {setIsSent(false); setSearchResults({})}, 1200)
    }
    
    async function getName() {
        const response = await axios.get(`http://localhost:3001/name/${sessionToken}`)
        setSender(response.data)
    }

    async function getUsers() {
        if (!searchTerm) return
        if (searchTerm===sender) {
            setResultMessage("Can't Search for Yourself.")
            return;
        }
        setLoading(true)
        try { 
            const response = await axios.get(`http://localhost:3001/friends/users?name=${searchTerm}&sessionToken=${sessionToken}`)
            setSearchResults(response.data)
            setResultMessage("No Results Found")
        } catch (err) {
            alert("Couldn't search for users")
        }
        setLoading(false)
    }

    async function sendRequest(e) {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3001/friends/send/${sessionToken}`, {
                "friend": searchResults
            })
        } catch (err) {
            alert(`${err.response.status} Error: ${err.response.data.message}`)
        }
    }
    async function seeRequests() {
        try {
            const response = await axios.get(`http://localhost:3001/friends/seeReqs/${sessionToken}`)
            setPending(response.data)
        } catch (err) {
            alert("Couldn't load friend requests")
        }
    }
    async function handleReq(e, name, status) {
        e.preventDefault()
        try {
            await axios.post(`http://localhost:3001/friends/${status}/${name}`, {
                "sessionToken": sessionToken
            })
            seeRequests()
            getFriends()
        } catch (err) {
            alert("Couldn't accept friend request")
        }
    }

    async function getFriends() {
        try {
            const response = await axios.get(`http://localhost:3001/friends/list/${sessionToken}`)
            setFriends(response.data)
        } catch {
            alert("Couldn't load friends.")
        }
    }
    async function getFriendBooks(name) {
        if (selectedFriend===name) {
            //clicking on the same person again closes their library
            setFriendBooks([])
            setSelectedFriend("")
            return;
        }
        setFriendLoading(true)
        try {
            const response = await axios.get(`http://localhost:3001/friends/books/${name}`)
            setFriendBooks(response.data)
            setSelectedFriend(name)
        } catch {
            alert(`Couldn't load ${name}'s books.`)
        }
        setFriendLoading(false)
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
        {if (sessionToken!==null) {
            getRecent()
            getFriends()
            seeRequests()
            getName()
        }}
      },[])

    return (
        <div className="home">
            <div className={sessionToken===null ? "logged-out-home" : "hidden"}>
                <p>Must login to view home page</p>
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
                <div className="friends">
                    <form className="search-friends">
                        <label htmlFor="search">Find new friends: </label>
                        <input type="text" id="search" placeholder="search by username..." 
                            onChange={(e) => {setSearchTerm(e.target.value)}}>
                        </input>
                        <input type="submit" value="search" onClick={(e) => {e.preventDefault(); getUsers()}}/>
                        <input type="reset" value="clear" onClick={(e) => {setSearchTerm(""); setResultMessage(""); setSearchResults({})}}></input>
                        <br/><br/>
                        <div className={isSent ? "colored" : "hidden"}> Sent request to {searchResults.username}!</div>
                        <div className={Object.keys(searchResults).length===0 ? "no-res" : "hidden"}>
                            {loading ? "Loading..." : resultMessage}
                        </div>
                        <div className={Object.keys(searchResults).length!==0 ? "res" : "hidden"}>
                            {searchResults.username}, joined on {new Date(Date.parse(searchResults.createdAt)).toLocaleDateString()}
                            <button className={isSent ? "hidden" : "send-btn"} onClick={(e) => {
                                sendRequest(e);
                                setSearchTerm(""); 
                                message();
                            }}>send friend request</button>
                        </div>
                    
                    </form>
                    <div className="requests">
                        Your friend requests:
                        <button className="refresh" onClick={(e) => {e.preventDefault(); seeRequests()}}><img src={img}/></button>
                        {pending?.map(r => {
                            return <div className="request-names" key={r.objectId}>{r.fromName} 
                            <button onClick={(e) => handleReq(e, r.fromName, "accept")}>Accept</button>
                            <button onClick={(e) => handleReq(e, r.fromName, "deny")}>Deny</button>
                            </div>
                        })}
                    </div>
                </div>
                <div className="friends-library-list">
                    <div className="view-friends">
                        <h1>My friends:</h1>
                        {friends.from?.map(f => {
                            return <div className="friend-name-list" onClick={() => getFriendBooks(f.toName)} key={f.objectId}>{f.toName}</div>
                        })}
                        {friends.to?.map(f => {
                            return <div className="friend-name-list" onClick={() => getFriendBooks(f.fromName)} key={f.objectId}>{f.fromName}</div>
                        })}
                    </div>
                    <FriendBooks friendBooks={friendBooks} selectedFriend={selectedFriend} friendLoading={friendLoading}/>
                </div>
                {selectedFriend ? <LiveChat sender={sender} receiver={selectedFriend}/> : ""}
            </div>            
        </div>
    )
}