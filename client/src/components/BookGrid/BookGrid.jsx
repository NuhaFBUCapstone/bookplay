import "./BookGrid.css"
import * as React from "react"
import BookCard from "../BookCard/BookCard"
import axios from "axios"
import { useState, useEffect } from "react"
import {Link} from "react-router-dom"



export default function BookGrid({sessionToken}) {
    const [search, setSearch] = useState ("")
    const [results, setResults] = useState([])
    const [fetching, setFetching] = useState(false)
    const [recs, setRecs] = useState([])

    async function getRecs() {
        const response = await axios.get(`http://localhost:3001/recs/${sessionToken}`)
        setRecs(response.data)
    }
    useEffect(() => {
        {if (sessionToken!==null) {
            getRecs()
        }}
      },[])

    async function getSearch() {
        if (!search) return;
        setFetching(true)
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=35&langRestrict=en`)
            setResults(response.data.items)
        } catch (err) {
            alert("Couldn't retrieve search results.")
        }
        setFetching(false)
    }

    return (
        <div className="search-page">
        <div className="side">
            <form className="search-bar">
                <input type="text" onChange={(e) => {
                    setSearch(e.target.value)
                }} className="bar" placeholder="Type Here" /> 
                <input id="search-btn" type="submit" value="search" onClick={(e) => {e.preventDefault(); getSearch()}}/> 
                <input id="search-btn" type="reset" value="clear" onClick={(e) => {e.preventDefault(); setResults([])}}/>            
            </form>
            </div>
            {(!fetching && results.length===0) ? <div className="rec-title">
                <h2>Need Something New?</h2>
                <p>Based on recent books you've liked, we recommend these: </p>
                <div className="recs-outer">
                    {recs?.map(b => {
                        return <div className="recs-grid" key={b.objectId}>
                            <Link to={`/book/${b.bookId}`}><img className="recents-image" src={b.image}/><br/></Link>
                            {b.title}<br/>
                        </div>
                    })}
                </div><br/></div>: ""}
            {fetching ? <h1 className="load">Loading...</h1> :
            <div className={results.length===0 ? "hidden" : "grid"}>
                {results.map(b => {
                    return <BookCard key={b.id} book={b.volumeInfo} bookId={b.id} imageArr={b.volumeInfo.imageLinks?.thumbnail}/>
                })}
            </div>}
        </div>
    )
}