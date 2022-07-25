import * as React from "react"
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom"
import axios from "axios"

import "./BookDetail.css"

export default function BookDetail(props) {
    const params = useParams();
    const [book, setBook] = useState({})
    const [fetching, setFetching] = useState(false)
    const [opts, setOpts] = useState([])
    const [list, setList] = useState("")
    const [reviews, setReviews] = useState([])
    const [myReview, setMyReview] = useState("")
    const [myRating, setMyRating] = useState(0)
    
    /**
     * get dropdown options
     */
    async function getDropdown() {
        try {
            const response = await axios.get(`http://localhost:3001/library/${props.sessionToken}`)
            let test = Object.keys(response.data)
            let temp = []
            test.map((l, idx) => {
                temp.push(<option key={idx}>{l}</option>)
            })
            setOpts(temp)
        } catch (err) {
            alert(`Couldn't get list options: ${err}`)
        }
    }

    /**
     * get book details from google API
     */
    async function getDetails() {
        try {
            setFetching(true)
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
            setBook(response.data)
            const reviewResponse = await axios.get(`http://localhost:3001/reviews/${response.data.id}`)
            setReviews(reviewResponse.data)
        } catch (err) {
            setBook(undefined)
        }
        setFetching(false)
    }
    useEffect(() => {
        getDetails()
        {if (props.sessionToken!==null) getDropdown()}
    }, [])

    /**
     * add book to list and save details and image to database
     */
    async function addBook() {
        if (list==="") return
        try {
            const response = await axios.post(`http://localhost:3001/books/add/${book.id}`, {
                "sessionToken": props.sessionToken, "list": list, "title": book.volumeInfo?.title,
                "image": getImage(), "author": book.volumeInfo?.authors ? book.volumeInfo?.authors[0] : "[unknown]"
            })
        } catch (err) {
            alert("Couldn't add book.")
        }
    }

    /**
     * add review and rating to database and display on page
     */
    async function addReview() {
        try {
            const response = await axios.post(`http://localhost:3001/reviews/add/${book.id}`, {
                "sessionToken": props.sessionToken, "review": myReview, "rating": myRating
            })
            setReviews(prev => [...prev, response.data])     
        } catch (err) {
            alert("Couldn't add review.")
        }
    }

    /**
     * helper function to get image
     * @returns the largest image available
     */
    const getImage = () => {
        if (!book.volumeInfo) return
        const keys = Object.keys(book.volumeInfo?.imageLinks)
        return book.volumeInfo?.imageLinks[keys[keys.length-1]]
    }

    return (
        <div className="book-detail">
            {fetching ? <h1>Loading...</h1> : 
            (book===undefined) ? <div className="not-found">That book doesn't exist...</div> : 
            <div className="defined">
                <div className="test">
                    <img className="photo" src={getImage()}/>
                    <div className="details">Page Count: {book.volumeInfo?.printedPageCount}<br/>
                        Published Date: {book.volumeInfo?.publishedDate}<br/>
                        <a href={book.saleInfo?.buyLink} className={book.saleInfo?.saleability==="NOT_FOR_SALE" ? "hidden":"buy"}>
                            Click to Buy</a>
                    </div> 
                </div>
                <div className="title">"{book.volumeInfo?.title}" by {book.volumeInfo?.authors ? book.volumeInfo?.authors[0] : "[unknown]" }
                <br/></div>
                <div className="desc" dangerouslySetInnerHTML={{__html: book.volumeInfo?.description}}></div>
                <div className={props.sessionToken===null ? "hidden" : "dropdown-outer"}>
                    <label className="label">Add to List: </label>
                    <select className="dropdown" onChange={e => {setList(e.target.value)}}>
                        <option></option>
                        {opts}
                    </select>
                    <button onClick={addBook}>Add</button>
                </div><br/>
                <h2>Ratings and Reviews:</h2>
                <form className={props.sessionToken===null ? "hidden" : "review"}>
                    <label className="review-label">Your Review: </label>
                    <textarea className="review-type" type="text" placeholder="Thoughts?" rows={5} cols={40}
                    onChange={(e) => {
                    setMyReview(e.target.value)
                }}/>
                <br/> Your Rating: 
                <div onChange={(e) => {setMyRating(parseInt(e.target.value))}}>
                    <input name="rating-type" id="1" type="radio" value="1"/>
                    <label htmlFor="1">1</label>
                    <input name="rating-type" id="2" type="radio" value="2"/>
                    <label htmlFor="2">2</label>
                    <input name="rating-type" id="3" type="radio" value="3"/>
                    <label htmlFor="3">3</label>
                    <input name="rating-type" id="4" type="radio" value="4"/>
                    <label htmlFor="4">4</label>
                    <input name="rating-type" id="5" type="radio" value="5"/>
                    <label htmlFor="5">5</label>
                    <input name="rating-type" id="none" type="radio" value="0"/>
                    <label htmlFor="none">No Rating</label>
                </div>
                <br/>
                    <input type="submit" value="Send" onClick={(e) => {e.preventDefault(); 
                        if (myReview.trim().length!==0) addReview()}}/>
                </form>
                <div className="ratings">{reviews.slice().reverse().map(r => {
                    return <div key={r.objectId}>
                        <p>{r.username}: {r.review} 
                        <br/> 
                        {r.rating===0 ? "" : `Rating: ${r.rating}/5`} 
                        {r.rating===0 ? "" : <br/>} 
                        Created at: {new Date(Date.parse(r.createdAt)).toLocaleString()}</p>
                        </div>
                })}</div>
            </div>
    }
        </div>
    )
}