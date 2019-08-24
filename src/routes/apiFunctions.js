const jwt = require('jsonwebtoken')
const request = require('request-promise-native')
let clients = []
let policies = []

setup()

/**
 * Helper method for looping through arrays with promises
 * @param  {Function} callback The callback is called in every loop
 */
Array.prototype.asyncForEach = function (callback) {
    return new Promise(resolve => {
        for(let i = 0; i < this.length; i++) {
            callback(this[i], i, this)
        }
        resolve()
    })
}

/**
 * Sets up the policies and clients in the corresponding arrays to create a fake database
 */
async function setup() {
    clients = (await require('https://www.mocky.io/v2/5808862710000087232b75ac')).clients
    policies = (await require('https://www.mocky.io/v2/580891a4100000e8242b75c5')).policies
}

/**
 * To force the user to connect with a username before being able to make requests
 * @param  {object}   req  The request object
 * @param  {object}   res  The response object
 * @param  {Function} next The next middleware function to pass successful requests
 */
function protectRoute(req, res, next) {
	if (req.user) next()
	else res.status(400).json({
        ok: false,
        msg: 'You must be logged to access this page, ',
    })
}

/**
 * To login as a specific user from the list of available users
 * Requires that you pass the username in the query like so: /login?user=example@gmail.com
 */
async function login(req, res) {
    if (!req.query || !req.query.user) return res.status(200).json({
        ok: false,
        msg: 'You need to pass your user in the query parameters like this: /login?user=example@gmail.com'
    })

    let user = req.query.user
    let foundUser = false
    let token = {}

    // Search the user in the list of clients
    await clients.asyncForEach(client => {
        if (client.email == user) {
            foundUser = true
            user = client
        }
    })

    if (!foundUser) {
        return res.status(200).json({
            ok: false,
            msg: 'Could not find that user email',
        })
    } else {
        // Create the JWT token based on that new user
        token = jwt.sign({userId: user.id}, process.env.SALT)

        // If the user was added successful, return the user credentials
        return res.status(200).json({
            ok: true,
            msg: 'User logged in successfully',
            token,
        })
    }
}

module.exports = {
    protectRoute,
    login,
    setup,
}
