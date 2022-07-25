const express = require("express")
const router = express.Router()
var cors = require('cors');
const Playlist = require("../models/playlist")

router.use(cors())

router.get('/search/:term', async (req, res, next) => {
    const list = await Playlist.search(req.params.term, req.body.token)
    res.status(201).send(list)
  })

module.exports = router