const jwt = require('jsonwebtoken')
const request = require('request-promise-native')

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
//  */
function setup() {
    console.log('Setting up clients and policies...')
    let clients = []
    let policies = []
    return new Promise(async resolve => {
        clients = JSON.parse(await request.get({
            url: 'https://www.mocky.io/v2/5808862710000087232b75ac',
            rejectUnauthorized: false,
        })).clients
        policies = JSON.parse(await request.get({
            url: 'https://www.mocky.io/v2/580891a4100000e8242b75c5',
            rejectUnauthorized: false,
        })).policies
        console.log('Setup complete')
        resolve({clients, policies})
    })
}

/**
 * To force the user to connect with a username before being able to make requests
 * @param  {object}   req  The request object
 * @param  {object}   res  The response object
 * @param  {Function} next The next middleware function to pass successful requests
 */
function protectRoute(req, res, next) {
	if (req.session.user) next()
	else res.status(400).json({
        ok: false,
        msg: 'You must be logged to access this page',
    })
}

/**
 * To login as a specific user from the list of available users
 * Requires that you pass the username in the query like so: /login?user=example@gmail.com
 * @param  {object} req     The request object
 * @param  {object} res     The response object
 * @param  {array}  clients The array of clients to access and find the user email
 */
async function login(req, res, clients) {
    if (Object.keys(req.query).length == 0 || !req.query.user) return res.status(400).json({
        ok: false,
        msg: 'You need to pass your user in the query parameters like this: /user/login?user=example@gmail.com'
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
        return res.status(400).json({
            ok: false,
            msg: 'Could not find that user email',
        })
    } else {
        // Create the JWT token based on that new user
        token = jwt.sign({userId: user.id}, process.env.SALT)
        req.session.user = {
            ...user,
            token,
        }
        // If the user was added successful, return the user credentials
        return res.status(200).json({
            ok: true,
            msg: 'User logged in successfully',
            token,
        })
    }
}

/**
 * To get a specific user
 * Requires that you pass the username in the query like so: /login?user=example@gmail.com
 * @param  {object} req     The request object
 * @param  {object} res     The response object
 * @param  {array}  clients The array of clients to access and find the user email
 */
async function getUser(req, res, clients) {
    if (Object.keys(req.query).length == 0 || !req.session.user) return res.status(400).json({
        ok: false,
        msg: 'You need to pass an id or name query',
    })
    let isSearchById = req.query.id ? true : false
    let user = {}
    let foundUser = false

    // Search the user in the list of clients
    await clients.asyncForEach(client => {
        if ((isSearchById && client.id == req.query.id) || (!isSearchById && client.name == req.query.name)) {
            foundUser = true
            user = client
        }
    })

    if (!foundUser) {
        return res.status(400).json({
            ok: false,
            msg: 'Could not find that user',
        })
    } else {
        // If the user was added successful, return the user credentials
        return res.status(200).json({
            ok: true,
            msg: 'User found successfully',
            user,
        })
    }
}

/**
 * Returns the list of policies when passing a query name
 * @param  {object} req      The request object
 * @param  {object} res      The response object
 * @param  {array}  clients  The array of clients to find the user id for searching policies
 * @param  {array}  policies The array of policies to find the user policies requested
 */
async function getPolicies(req, res, clients, policies) {
    if (Object.keys(req.query).length == 0 || !req.session.user || !req.query.name) return res.status(400).json({
        ok: false,
        msg: 'You need to pass a name query',
    })
    if (req.session.user.role != 'admin') return res.status(400).json({
        ok: false,
        msg: 'Only admin users can find policies by user name',
    })
    let policiesFound = []
    let foundPolicies = false
    let user = {}
    let foundUser = false

    // Search the user in the list of clients to have access to the user id for the policies
    await clients.asyncForEach(client => {
        if (client.name == req.query.name) {
            foundUser = true
            user = client
        }
    })

    if(!foundUser) return res.status(400).json({
        ok: false,
        msg: 'The requested user could not be found',
    })

    await policies.asyncForEach(policy => {
        if (policy.clientId == user.id) {
            foundPolicies = true
            policiesFound.push(policy)
        }
    })

    if(!foundPolicies) return res.status(200).json({
        ok: true,
        msg: 'Policies not found for that user',
    })

    return res.status(200).json({
        ok: true,
        msg: 'Policies found successfully',
        policies: policiesFound,
    })
}

/**
 * Returns a user object when passing a policyId query, the user linked to a policy number
 * @param  {object} req      The request object
 * @param  {object} res      The response object
 * @param  {array}  clients  The array of clients to find the user id for searching policies
 * @param  {array}  policies The array of policies to find the user policies requested
 */
async function getUserByPolicyId(req, res, clients, policies) {
    if (Object.keys(req.query).length == 0 || !req.session.user || !req.query.id) return res.status(400).json({
        ok: false,
        msg: 'You need to pass an id query',
    })
    if (req.session.user.role != 'admin') return res.status(400).json({
        ok: false,
        msg: 'Only admin users can find users by policy ID',
    })
    let foundUser = false
    let foundPolicy = false
    let clientId = ''
    let user = {}

    await policies.asyncForEach(policy => {
        if(policy.id == req.query.id) {
            foundPolicy = true
            clientId = policy.clientId
        }
    })

    if(!foundPolicy) return res.status(400).json({
        ok: false,
        msg: 'The policy id requested does not exist',
    })

    await clients.asyncForEach(client => {
        if(client.id == clientId) {
            foundUser = true
            user = client
        }
    })

    if(!foundUser) return res.status(400).json({
        ok: false,
        msg: 'Could not find the user linked to the requested policy ID',
    })

    return res.status(200).json({
        ok: true,
        msg: 'User found successfully',
        user,
    })
}

module.exports = {
    protectRoute,
    login,
    setup,
    getUser,
    getPolicies,
    getUserByPolicyId,
}
