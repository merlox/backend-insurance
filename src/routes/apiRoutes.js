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
api.get('/login', async (req, res) => {
    await functions.login(req, res, clients)
})
api.post('/user', functions.protectRoute, async (req, res) => {

})

/**
 * To login with an existing user
 * 1. Check if user already exists
 * 2. If not, return a message saying user not found
 * 3. If found, generate the JWT token and send it
*/
api.post('/user/login', async (req, res) => {

})

module.exports = api
