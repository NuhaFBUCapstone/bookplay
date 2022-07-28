const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())
/**
 * get recommended books based on other readers who have the same book saved
 */
router.get('/:sessionToken', async (req, res) => {
    const possibleRecs = await getBooks(req.params.sessionToken)
    //mapping for popularity
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

  async function getBooks(sessionToken) {
    //using the most recent positively reviewed book to create recs:
    let query = new Parse.Query("_Session").equalTo("sessionToken", sessionToken)
    let userId = await query.first({useMasterKey : true})
    userId = userId.attributes.user.id
    let reviewQuery = new Parse.Query("Reviews")
    reviewQuery.equalTo("userId", userId)
    reviewQuery.greaterThan("rating", 3)
    reviewQuery.descending("createdAt")
    let bookSeed = await reviewQuery.first()
    //if user has not left any positive reviews, return empty array
    if (!bookSeed) {
        return []
    }
    let bookQuery = new Parse.Query("Books")
    bookQuery.equalTo("bookId", bookSeed.attributes.bookId)
    bookQuery.notEqualTo("userId", userId) //to get different user
    bookQuery.equalTo("list", "Read")
    let otherUsers = await bookQuery.find()
    //otherUsers tells us all the users that also have bookSeed saved 
    let otherUserIds = otherUsers.map(u => {
        return u.attributes.userId
    })
    let userQuery = new Parse.Query("Books").equalTo("list", "Read")
    userQuery.containedIn("userId", otherUserIds)
    userQuery.notEqualTo("bookId", bookSeed.attributes.bookId)  
    userQuery.doesNotMatchKeyInQuery("bookId", "bookId", new Parse.Query("Books").equalTo("userId", userId))
    //exclude all of the books the user has already saved
    return await userQuery.find()
  }

module.exports = router