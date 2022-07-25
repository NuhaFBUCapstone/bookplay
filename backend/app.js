const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Parse = require('parse/node');
const playlistRoute = require("./routes/playlist")
const bookRoute = require("./routes/books")
const libraryRoute = require("./routes/library")
const reviewRoute = require("./routes/reviews")

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use("/playlist", playlistRoute)
app.use("/books", bookRoute)
app.use("/library", libraryRoute)
app.use("/reviews", reviewRoute)

const MASTERKEY = "6wssvUvxnn7VBB0mUhboQM7F7TaaBKk8sU1Ic6vE"
const APPKEY = "3PRkrcUCakVV2GzHDYS5svrNa7CK5TBD7WfiNogY"
const JSKEY = "QThaAFJyq0JMnn4yytCSPJUt9kdFqffclXAZeYBA"
Parse.initialize(APPKEY, JSKEY, MASTERKEY);
Parse.serverURL = 'http://parseapi.back4app.com/'


app.post('/logout', async (req, res) => {
  try {
  let query = new Parse.Query("_Session")
  query.equalTo("sessionToken", req.body.sessionToken)
  query.first( { useMasterKey : true}).then(function (user) {
    if (user) {
      user
      .destroy({useMasterKey: true})
      .then (res.status(200).send("logged out"))
      .catch(function (err) {
        res.status(400)
        res.send({ Message: err.message, typeStatus: "danger"});
      })
    } else {
      res.send();
    }
  })
} catch (err) {

}
})


app.post('/login', async (req, res) => {
  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password)
    res.send({"user": user, "sessionToken": await user.getSessionToken()})
  } catch (error) {
    res.status(400)
    res.send({"error" : "Login failed. " + error })
  }
})


app.post('/register', async(req, res) => {
    let user = new Parse.User(req.body);
      user.signUp().catch((e) => {res.status(400).send(e.message)})
      user.set("lists", ["Read", "Reading", "Want to Read"])
      await user.save(null, { useMasterKey: true })
      res.status(201).send({"user": user, "sessionToken": await user.getSessionToken()})
})

module.exports = app