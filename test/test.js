const supertest = require('supertest')
const should = require('should')
let server = supertest.agent('http://localhost:8000')

describe('Testing functions', () => {
    beforeEach(() => {
        server = supertest.agent('http://localhost:8000')
    })
    it('should be able to login as an existing user', () => {
        return new Promise((resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            server
                .get('/v1/user/login?user=' + userEmail)
                .expect(200)
                .end((err, res) => {
                    if (err) return reject(err)
                    res.body.ok.should.ok()
                    res.body.msg.should.equal('User logged in successfully')
                    res.body.token.should.be.type('string')
                    resolve()
                })
        })
    })
    it('should not be able to login with an unknown user', () => {
        return new Promise((resolve, reject) => {
            const userEmail = 'notfound@example.com'
            server
                .get('/v1/user/login?user=' + userEmail)
                .expect(400)
                .end((err, res) => {
                    if (err) return reject(err)
                    res.body.ok.should.not.ok()
                    res.body.msg.should.equal('Could not find that user email')
                    resolve()
                })
        })
    })
    it('should return an error when not sending the login user', () => {
        return new Promise((resolve, reject) => {
            server
                .get('/v1/user/login')
                .expect(400)
                .end((err, res) => {
                    if (err) return reject(err)
                    res.body.ok.should.not.ok()
                    res.body.msg.should.equal('You need to pass your user in the query parameters like this: /user/login?user=example@gmail.com')
                    resolve()
                })
        })
    })
    it('should not allow API access without login first', () => {
        return new Promise((resolve, reject) => {
            const findUser = 'adeleblankenship@quotezart.com'
            server
                .get('/v1/user?user=' + findUser)
                .expect(400)
                .end((err, res) => {
                    if (err) return reject(err)
                    res.body.ok.should.not.ok()
                    res.body.msg.should.equal('You must be logged to access this page')
                    resolve()
                })
        })
    })
    it('should not get a user without query parameters', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user')
                    .expect(400)
                response.body.ok.should.not.ok()
                response.body.msg.should.equal('You need to pass your user in the query parameters like this: /user?user=example@gmail.com')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
})
