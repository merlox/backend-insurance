/**
 * The main server file receiving all incoming requests while sending the API ones
 * to the apiRouter.
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const setup = require('./setup')
const apiRoutes = require('./routes/apiRoutes.js')
const port = 8000

// Required to generate randomized JWT tokens
process.env.SALT = 'express'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
	next()
})
app.use('/v1', apiRoutes)
app.listen(port, '0.0.0.0', (req, res) => {
	console.log(`Listening on localhost:${port}`)
})
