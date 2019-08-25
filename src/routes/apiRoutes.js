const express = require('express')
const api = express.Router()
const functions = require('./apiFunctions.js')
let clients = []
let policies = []

setup()

async function setup () {
    const results = await functions.setup()
    clients = results.clients
    policies = results.policies
}

/**
 * To login as an existing user from the API and get a JWT token usable in API requests
 */
api.get('/user/login', async (req, res) => {
    await functions.login(req, res, clients)
})
api.post('/user', functions.protectRoute, async (req, res) => {

})

module.exports = api
