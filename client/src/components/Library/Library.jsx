import * as React from "react"
import {Link} from "react-router-dom"
import "./Library.css"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Library({sessionToken}) {
    const [books, setBooks] = useState({})
    const [list, setList] = useState("")
    const [adding, setAdding] = useState("")

    /**
     * get users lists and saved books and store it as a state variable
     */
    async function getLists() {
        try {
            const response = await axios.get(`http://localhost:3001/library/${sessionToken}`)
            setBooks(response.data)
        } catch (err) {
            alert("Couldn't get lists.")
        }
    }
    useEffect(() => {
        if (sessionToken!==null) getLists()
      },[])


    /**
     * adds list to library after "add list" is double clicked 
     */
    async function addList(e) {
        e.preventDefault();
        if (adding==="show") {
            setAdding("");
            return;
        }
        try {
            await axios.post(`http://localhost:3001/library/add/${adding}`, {
                "sessionToken": sessionToken
            })
            setBooks(prev => ({
                ...prev,
                ...books[adding] = []
            }))
        } catch (err) {
            alert("")
        }
        setAdding("")
    }

    /**
     * deletes list from library after button is clicked
     */
    async function deleteList(e) {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3001/library/delete/${list}`, {
                "sessionToken": sessionToken
            })
            let copy = {...books}
            delete copy[list]
            setBooks(books => ({
                ...copy
            }))
            setList("")        
        } catch (err) {
            alert("Couldn't delete list.")
        }
    }

    /**
     * deletes book from specific list
     */
    async function deleteBook(e, bookId) {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3001/books/remove/${bookId}`, {
                "sessionToken": sessionToken, "list": list
            })
            getLists() //very slow!
        } catch (err) {
            alert("Couldn't delete book.")
        }
        return;
    }

    return (
        <div className="library">
            <div className={sessionToken===null ? "logged-out" : "hidden"}>
                <div>Must be logged in to view this page.
                <br></br>
                <Link to="/">login here</Link></div>
            </div> 
            <div className={sessionToken===null ? "hidden" : "flex"}>  
                <div className="library-side">
                    <p id="header">Lists:</p>
                    {Object.keys(books).map(l => {
                        return <p onClick={() => setList(l)} id="list">{l}</p>
                    })}
                    {adding!=="" ? <form onSubmit={addList}>
                        <input className="list-add-type" type="text" onChange={(e) => setAdding(e.target.value)}/>
                        <input className="hidden" type="submit" value="Submit" />
                    </form> : <p onDoubleClick={() => setAdding("show")} id="list-add">add list...</p>}
                </div>
                <div className="grid-side">
                <div className="grid-title">{list} <br/> 
                    <button className={(list==="" || list==="Read" || list==="Reading" || list==="Want to Read") ? 
                    "hidden" : "delete"} 
                    onClick={deleteList}>delete list
                    </button>
                </div>
                <div className="library-grid">
                    {books[list]?.map(b => {
                        return <div className="card" key={b.objectId}>
                            <Link id="test" to={`/book/${b.bookId}`} ><img className="lib-img" src={b.image}/></Link>
                            <p onClick={(e) => deleteBook(e, b.bookId)} className="delete-btn">delete book</p>
                            </div>
                    })}
                </div></div>
            </div>
        </div>
    )
}