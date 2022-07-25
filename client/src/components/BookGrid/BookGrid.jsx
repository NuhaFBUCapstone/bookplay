import "./BookGrid.css"
import * as React from "react"
import BookCard from "../BookCard/BookCard"
import axios from "axios"
import { useState } from "react"


export default function BookGrid() {
    const [search, setSearch] = useState ("")
    const [results, setResults] = useState([])
    const [fetching, setFetching] = useState(false)

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
            </form>
            </div>
            {fetching ? <h1 className="load">Loading...</h1> :
            <div className="grid">
                {results.map(b => {
                    return <BookCard key={b.id} book={b.volumeInfo} bookId={b.id} imageArr={b.volumeInfo.imageLinks?.thumbnail}/>
                })}
            </div>}
        </div>
    )
}