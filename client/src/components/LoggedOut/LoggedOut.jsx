import * as React from "react"
import "./LoggedOut.css"
import LoginForm from "../LoginForm/LoginForm"
import { Parallax } from 'react-parallax'
import bgImage from './coffee.jpg'
import { useState, useEffect } from "react"
import axios from "axios"


export default function LoggedOut(props) {
    const [bookCount, setBookCount] = useState(0)
    const [userCount, setUserCount] = useState(0)

    async function getCounts() {
        const response = await axios.get(`http://localhost:3001/stats`)
        setBookCount(response.data.books)
        setUserCount(response.data.users)
    }
    useEffect(() => {
        getCounts()
      },[])

    return (
        <div className="logged-out">
            <Parallax bgImage={bgImage} strength={-500} >
                <div className="parallax">
                        <div className="box">
                            <LoginForm setSessionToken={props.setSessionToken} sessionToken={props.sessionToken}/>
                        </div>
                    <h2 className="text-header">Today's Trending Books:</h2>
                {props.fetching ? <h3>Loading...</h3> :
                <div className="trend-box">
                    {props.trends?.map((b, idx) => {
                        return <div className="carousel" key={idx}>
                            <div className="text">{b.title}</div>
                            <img className="trends" src={`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`}/>
                        </div>
                    })}
                </div>}
                <h2 className="about-header">About Us: </h2>
                <div className="about-us">
                    <div className="about-text">
                            This website makes reading a full experience. 
                            With personalized playlists for any book you're reading, you always have 
                            something to listen to that lets you fully engage with your next read. 
                            Create lists, save books, and share your thoughts with friends!
                    </div>
                    <div className="stats-text">
                        Join our growing community!<br/>
                        <img src="https://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/512/users-icon.png"/>
                        {`Over ${userCount} users`}<br/>
                        <img src="https://www.iconpacks.net/icons/2/free-opened-book-icon-3163-thumb.png"/>
                        {`Over ${bookCount} books saved`}

                    </div>
                    <div className="about-text">
                        Unique Spotify integration generates a playlist for any book!<br/>
                        <img src="https://pnggrid.com/wp-content/uploads/2021/05/Black-spotify-icon-1024x1024.png"/>
                        <img src="https://icons.veryicon.com/png/o/miscellaneous/o2o-middle-school-project/plus-104.png"/>
                        <img src="https://cdn-icons-png.flaticon.com/512/29/29302.png"/>
                    </div>
                </div>
                </div>
            </Parallax>
           
        </div>
    )
}