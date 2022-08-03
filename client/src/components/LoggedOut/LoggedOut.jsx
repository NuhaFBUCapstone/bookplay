import * as React from "react"
import "./LoggedOut.css"
import LoginForm from "../LoginForm/LoginForm"
import { Parallax } from 'react-parallax'
import bgImage from './coffee.jpg'

export default function LoggedOut(props) {
    return (
        <div className="logged-out">
            <Parallax bgImage={bgImage} strength={-500} >
                <div className="parallax">
                        <div className={props.sessionToken ? "hidden" : "box"}>
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
                <h2 className="about-header">About Us</h2>
                <div className="about-us">
                        <p className="about-text">
                            This website is designed to make reading a full experience. 
                            With personalized playlists for any book you're reading, you always have 
                            something to listen to that lets you fully engage with your next read. 
                            Create lists, save books, and share your thoughts with friends!
                        </p>
                </div>
                <div>Stats:</div>
                </div>
            </Parallax>
           
        </div>
    )
}