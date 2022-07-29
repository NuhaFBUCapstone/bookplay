const express = require("express")
const router = express.Router()
var cors = require('cors');
const Playlist = require("../models/playlist")

router.use(cors())

router.post('/search/:term', async (req, res) => {
    const list = await Playlist.search(req.params.term, req.body.token)
    res.status(201).send(list)
  })

module.exports = router