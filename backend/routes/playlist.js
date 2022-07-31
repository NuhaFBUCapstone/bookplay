const express = require("express")
const router = express.Router()
var cors = require('cors');
const Playlist = require("../models/playlist")
const Parse = require('parse/node');

router.use(cors())

router.post('/search/:term', async (req, res) => {
    const list = await Playlist.search(req.params.term, req.body.token)
    res.status(201).send(list)
  })

router.post('/book/:search', async (req, res) => {
  const query = new Parse.Query(Parse.Session).equalTo("sessionToken", req.body.sessionToken)
  let userId = await query.first({useMasterKey: true})
  userId = userId.attributes.user.id
  const bookQuery = new Parse.Query("Books").equalTo("userId", userId)
  bookQuery.fullText("title", req.params.search)
  const books = await bookQuery.find()
  res.status(200).send(books)

})

module.exports = router