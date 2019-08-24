/**
 * This file is used to setup the database connection with mongoose
 */

const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://merlox:merlox1@ds213178.mlab.com:13178/general'
let client = {}
let db = {}

setup()

function connectToDatabase() {
	return new Promise((resolve, reject) => {
		const client = new MongoClient(mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		client.connect(err => {
			if (err) return reject('Could not connect to the mongo database, try again ' + err)
			console.log('Connected to the mongodb client')
			const db = client.db('topcoin')
			client.close()
			resolve(db)
		})
	})
}

async function setup () {
	db = await connectToDatabase()
}
