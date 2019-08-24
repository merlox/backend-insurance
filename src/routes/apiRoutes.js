const express = require('express')
const api = express.Router()
const functions = require('./apiFunctions.js')

/**
 * To login as an existing user from the API and get a JWT token usable in API requests
 */
api.get('/login', async (req, res) => {
    return functions.login()
})
api.post('/user', functions.protectRoute(), async (req, res) => {

})

/**
 * To login with an existing user
 * 1. Check if user already exists
 * 2. If not, return a message saying user not found
 * 3. If found, generate the JWT token and send it
*/
app.post('/user/login', async (req, res) => {

})

module.exports = api
