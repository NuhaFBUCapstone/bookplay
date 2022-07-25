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
        let books = await bookQuery.find({useMasterKey : true})
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
        //TODO: check if book is already in that list, no duplicates
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let objId = await query.first({useMasterKey : true})
        objId = objId.attributes.user.id
        const Books = Parse.Object.extend("Books")
        let book = new Books()
        book.set("bookId", req.params.id)
        book.set("userId", objId)
        book.set("list", req.body.list)
        book.set("title", req.body.title)
        book.set("image", req.body.image)
        book.set("author", req.body.author)
        await book.save()
        res.status(200).send(book)
    } catch (err) {
        res.status(400).send({"error" : "add failed. " + err })
    }

})

/**
 * remove a book from a list
 */
router.post('/remove/:id', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
            query.equalTo("sessionToken", req.body.sessionToken)
            let objId = await query.first({useMasterKey : true})
            //get user id using session
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
        res.status(200).send(book)
    } catch (err) {
        res.status(400).send({"error" : "remove failed. " + err })
    }
})

module.exports = router