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
                .get('/v1/user?email=' + findUser)
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
                response.body.msg.should.equal('You need to pass an id or name query')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should get a user by id once logged in', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            const userId = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user?id=' + userId)
                    .expect(200)
                response.body.ok.should.ok()
                response.body.msg.should.equal('User found successfully')
                response.body.user.should.be.type('object')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should get a user by name once logged in', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            const userName = 'Hatfield'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user?name=' + userName)
                    .expect(200)
                response.body.ok.should.ok()
                response.body.msg.should.equal('User found successfully')
                response.body.user.should.be.type('object')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should return an error if the user is not found', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            const userName = 'randomxzq'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user?name=' + userName)
                    .expect(400)
                response.body.ok.should.not.ok()
                response.body.msg.should.equal('Could not find that user')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should get the list of policies by user name if the logged in user has an admin role', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'darleneblankenship@quotezart.com' // This user has an admin role
            const userName = 'Manning'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/policies?name=' + userName)
                    .expect(200)
                response.body.ok.should.ok()
                response.body.msg.should.equal('Policies found successfully')
                response.body.policies.should.be.type('object')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should not get the list of policies by user name if the logged in user is not an admin', () => {
        // { id: 'cbe9e5c4-1fd2-461f-a51b-935025e7a753',
        // name: 'Dianne',
        // email: 'dianneblankenship@quotezart.com',
        // role: 'user' }
        return new Promise(async (resolve, reject) => {
            const userEmail = 'dianneblankenship@quotezart.com'
            const userName = 'Manning'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/policies?name=' + userName)
                    .expect(400)
                response.body.ok.should.not.ok()
                response.body.msg.should.equal('Only admin users can find policies by user name')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should not get the list of policies by user name if the requested user name does not exist', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'darleneblankenship@quotezart.com' // This user has an admin role
            const userName = 'randomxzq'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/policies?name=' + userName)
                    .expect(400)
                response.body.ok.should.not.ok()
                response.body.msg.should.equal('The requested user could not be found')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should get an empty list of policies by user name if the requested user name does not have any policies associated', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'darleneblankenship@quotezart.com' // This user has an admin role
            const userName = 'Hatfield'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/policies?name=' + userName)
                    .expect(200)
                response.body.ok.should.ok()
                response.body.msg.should.equal('Policies not found for that user')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should get a user linked to a policy number successfully', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'darleneblankenship@quotezart.com' // This user has an admin role
            const policyId = '4962c4b9-01cc-4cd3-a6c7-0e7b40b55b00'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user/policy?id=' + policyId)
                    .expect(200)
                response.body.ok.should.ok()
                response.body.msg.should.equal('User found successfully')
                response.body.user.should.be.type('object')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
    it('should not get a user linked to a policy number that does not exist', () => {
        return new Promise(async (resolve, reject) => {
            const userEmail = 'darleneblankenship@quotezart.com' // This user has an admin role
            const policyId = '123'
            try {
                // Login first
                const resp = await server
                    .get('/v1/user/login?user=' + userEmail)
                    .expect(200)
                // Access without query params
                const response = await server
                    .get('/v1/user/policy?id=' + policyId)
                    .expect(400)
                response.body.ok.should.not.ok()
                response.body.msg.should.equal('The policy id requested does not exist')
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    })
})
