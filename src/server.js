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
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoUrl = 'mongodb://merlox:merlox1@ds213178.mlab.com:13178/general'
const port = 8000

// Required to generate randomized JWT tokens
process.env.SALT = 'express'

app.use(session({
	secret: process.env.SALT,
	store: new MongoStore({
		url: mongoUrl,
		useUnifiedTopology: true,
	}),
	cookie: {
		// A month
		maxAge: 1000 * 60 * 60 * 24 * 30,
	},
	resave: true,
	unset: 'destroy',
	saveUninitialized: true,
}))
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
