const Parse = require('parse/node');
const express = require("express")
const router = express.Router()
var cors = require('cors');

router.use(cors())

router.get('/users/:name', async (req, res) => {
    try {
        let query = new Parse.Query("_User")
        query.equalTo("username", req.params.name)
        const user = await query.first({useMasterKey : true})
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})

router.post('/send/:sessionToken', async (req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        const session = await query.first({useMasterKey : true})
        let userQuery = new Parse.Query("_User")
        userQuery.equalTo("objectId", session.attributes.user.id)
        let user = await userQuery.first({useMasterKey : true})
        const Friend = Parse.Object.extend("Friends")
        let friend = new Friend()
        friend.set("fromUser", session.attributes.user.id)
        friend.set("toUser", req.body.friend.objectId)
        friend.set("fromName", user.attributes.username)
        friend.set("toName", req.body.friend.username)
        friend.set("status", "pending")
        await friend.save()
        res.status(200).send(friend)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})

router.get('/seeReqs/:sessionToken', async(req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.params.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let friendQuery = new Parse.Query("Friends")
        friendQuery.equalTo("status", "pending")
        friendQuery.equalTo("toUser", user)
        let requests = await friendQuery.find({useMasterKey : true})
        res.status(200).send(requests)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})

router.post('/accept/:name', async(req, res) => {
    try {
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", req.body.sessionToken)
        let user = await query.first({useMasterKey : true})
        user = user.attributes.user.id
        let friendQuery = new Parse.Query("Friends")
        console.log(user)
        friendQuery.equalTo("fromName", req.params.name)
        friendQuery.equalTo("toUser", user) 
        friendQuery.equalTo("status", "pending")
        let request = await friendQuery.first({useMasterKey : true})
        console.log(request)
        request.set("status", "current")
        await request.save()
        res.status(200).send(request)
    } catch (err) {
        res.status(400).send({"error" : err })
    }
})


module.exports = router