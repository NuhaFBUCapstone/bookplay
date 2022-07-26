const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())
/**
 * get recommended books based on other readers who have the same book saved
 */
router.get('/:sessionToken', async (req, res) => {
    //using the most recent positively reviewed book to create recs:
    let query = new Parse.Query("_Session")
    query.equalTo("sessionToken", req.params.sessionToken)
    let userId = await query.first({useMasterKey : true})
    userId = userId.attributes.user.id
    let reviewQuery = new Parse.Query("Reviews")
    reviewQuery.equalTo("userId", userId)
    reviewQuery.greaterThan("rating", 3)
    reviewQuery.descending("createdAt")
    let bookSeed = await reviewQuery.first({useMasterKey : true})
    let bookQuery = new Parse.Query("Books")
    bookQuery.equalTo("bookId", bookSeed.attributes.bookId)
    bookQuery.notEqualTo("userId", userId) //to get different user
    bookQuery.equalTo("list", "Read")
    let userLists = await bookQuery.find({useMasterKey : true})
    let unfilteredRecs = userLists.map(async (u) => {
        let userQuery = new Parse.Query("Books")
        userQuery.equalTo("userId", u.attributes.userId)
        userQuery.equalTo("list", "Read")
        userQuery.notEqualTo("bookId", bookSeed.attributes.bookId)
        let userQueryRes = await userQuery.find({useMasterKey : true})
        return userQueryRes
    })
    unfilteredRecs = await Promise.all(unfilteredRecs)
    unfilteredRecs = unfilteredRecs.flat()
    //filter out the books already in the user's bookshelf
    let filterQuery = new Parse.Query("Books")
    filterQuery.equalTo("userId", userId)
    const filterBooks = await filterQuery.find({useMasterKey: true})
    const possibleRecs = unfilteredRecs.filter(rec => {
        for (let i=0; i<filterBooks.length; i++) {
            if (filterBooks[i].attributes.bookId===rec.attributes.bookId) {
                return false
            }
        }
        return true
    })
    let popularity = {}
    possibleRecs.forEach(r => {
        if (popularity[r.attributes.bookId]) popularity[r.attributes.bookId][1] += 1
        else {
            popularity[r.attributes.bookId] = [r, 1]
        }
    })
    let finalRecs = []
    Object.keys(popularity).sort((a, b) => popularity[b][1] - popularity[a][1]).forEach((key, idx) =>
    {
       if(idx < 4){
          finalRecs[idx] = popularity[key][0];
       }
    })
    //returns 4 recommendations
    res.status(200).send(finalRecs)
  })

module.exports = router