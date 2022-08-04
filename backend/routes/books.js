const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

/**
 * get user's recent books to display on home page
 */
router.get('/recent/:sessionToken', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let bookQuery = new Parse.Query("Books")
        bookQuery.equalTo("userId", user)
        bookQuery.descending("createdAt")
        let books = await bookQuery.find()
        res.status(200).send(books.slice(0, 5))
    } catch (err) {
        res.status(400).send({"error" : "couldn't get recent" + err })
    }
})

/**
 * add a book to a list
 */
router.post('/add/:id', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let objId = await query.first({useMasterKey : true})
        objId = objId.attributes.user.id
        let bookQuery = new Parse.Query("Books").equalTo("userId", objId)
        bookQuery.equalTo("bookId", req.params.id)
        bookQuery.equalTo("list", req.body.list)
        let checkBook = await bookQuery.first()
        if (checkBook) {
            //if book already exists in that list
            res.status.send(checkBook);
            return;
        }
        const Books = Parse.Object.extend("Books")
        let book = new Books()
        book.set("bookId", req.params.id)
        book.set("userId", objId)
        book.set("list", req.body.list)
        book.set("title", req.body.title)
        book.set("image", req.body.image)
        book.set("author", req.body.author)
        const genre = parseGenre(req.body.category)
        book.set("category", genre)
        book.set("avgRating", req.body.avgRating)
        book.set("ratingsCount", req.body.ratingsCount)
        await book.save()
        res.status(200).send(book)
    } catch (err) {
        res.status(400).send({"error" : "add failed. " + err })
    }

})
function parseGenre(category) {
    if (category==="Fiction") return category
    const genreArray = category.split(" / ")
    let genre = ""
    genreArray[genreArray.length-1]==="General" ? 
        (genre = genreArray[genreArray.length-2]) : (genre = genreArray[genreArray.length-1])
    return genre.replace("& ", "")
}


/**
 * remove a book from a list
 */
router.post('/remove/:id', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let objId = await query.first({useMasterKey : true})
        objId = objId.attributes.user.id
        let book = new Parse.Query("Books")
        book.equalTo("bookId", req.params.id)
        book.equalTo("userId", objId)
        book.equalTo("list", req.body.list)
        let response = await book.first()
        if (response) {
            //if book exists:
            await response.destroy()
        }
        res.status(200).send("removed")
    } catch (err) {
        res.status(400).send({"error" : "remove failed. " + err })
    }
})

module.exports = router