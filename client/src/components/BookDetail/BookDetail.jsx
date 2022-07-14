import * as React from "react"
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom"
import axios from "axios"

import "./BookDetail.css"

export default function BookDetail(props) {
    const [book, setBook] = useState({})
    const [fetching, setFetching] = useState(false)
    //TODO: get/post requests for user specific data from backend (ratings and reviews and add to list)
    const [opts, setOpts] = useState([])
    const [list, setList] = useState("")

    async function getLists() {
        //merge with Library?
        try {
            // setOpts([])
            const response = await axios.get(`http://localhost:3001/library/${props.sessionToken}`)
            let test = Object.keys(response.data)
            let temp = []
            test.map((l, idx) => {
                temp.push(<option key={idx}>{l}</option>)
            })
            setOpts(temp)
        } catch (err) {
            console.log(err)
        }
    }

    const params = useParams();
    async function getDetails() {
        try {
            setFetching(true)
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
            console.log(response.data)
            setBook(response.data)
        } catch (err) {
            console.log(`error getting book details: ${err}`)
            setBook(undefined)
        }
        setFetching(false)
    }
    useEffect(() => {
        getDetails()
        {if (props.sessionToken!=="") getLists()}
    }, [])

    async function addBook() {
        if (list==="") return
        try {
            const response = await axios.post(`http://localhost:3001/books/add/${book.id}`, {
                "sessionToken": props.sessionToken, "list": list, "title": book.volumeInfo.title,
                "image": book.volumeInfo.imageLinks?.large, "author": book.volumeInfo.authors[0]
            })
            console.log(response.data)
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className="book-detail">
            {fetching ? <h1>Loading...</h1> : 
            (book===undefined) ? <div className="not-found">That book doesn't exist...</div> : 
            <div className="defined">
                <img className="photo" src={book.volumeInfo?.imageLinks.large}/>
                {/* map through image links and figure out which is actually there ? ex: while (undefined) */}
                <div className="title">"{book.volumeInfo?.title}" by {book.volumeInfo?.authors[0]}<br/></div>
                <p>Description: {book.volumeInfo?.description}</p>
                <div className={props.sessionToken==="" ? "hidden" : "dropdown-outer"}>
                    <label className="label">Add to List: </label>
                    <select className="dropdown" onChange={e => {setList(e.target.value)}}>
                        <option></option>
                        {opts}
                    </select>
                    <button onClick={addBook}>Add</button>
                </div>
            </div>
    }
        </div>
    )
}