const supertest = require('supertest')
const should = require('should')
const server = supertest.agent('http://localhost:8000')

describe('Testing functions', () => {
    it('should be able to login as an existing user', async done => {
        const userEmail = 'manningblankenship@quotezart.com'
        server
            .get('/v1/login?user=' + userEmail)
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                res.status.should.equal(200)
                res.body.error.should.equal(false)
                done()
            })
    })
    it('should not allow API access without login first')
})
