/**
 * This file is used to setup the database connection with mongoose
 */

const mongoose = require('mongoose')
let db = {}

// Note that this endpoint should be saved in a process.env variable to avoid exposing
// it to external users, I just added it here for simplicity
mongoose.connect('mongodb://example:example1@ds157707.mlab.com:57707/authentication', {
	useNewUrlParser: true,
	useCreateIndex: true,
})
db = mongoose.connection
db.on('error', err => {
	console.log('Error connecting to the database', err)
})
db.once('open', function() {
    console.log('Opened database connection')
})
