import * as React from "react"
import "./FriendBooks.css"
import {Link} from "react-router-dom"

export default function FriendBooks({friendBooks, selectedFriend, friendLoading}) {

    return (
        <div className="friend-books">
            {friendLoading ? <h1>Loading...</h1> :
            <div className={selectedFriend ? "friend-library" : "hidden"}>
                <h1>{selectedFriend} is Currently Reading:</h1>
                <div className="friend-grid">
                    {friendBooks.map(b => {
                        return <div className="friend-card" key={b.objectId}>
                            <Link to={`/book/${b.bookId}`}><img src={b.image}/></Link>
                            <p className="friend-title">{b.title}</p>
                            <p className="friend-genre">{b.category}</p>
                            <p>Started on: {new Date(Date.parse(b.createdAt)).toLocaleDateString()}</p>
                        </div>
                    })}
                </div>
            </div>
            }
        </div>
    )
}