const supertest = require('supertest')
const should = require('should')
const server = supertest.agent('http://localhost:8000')

describe('Testing functions', () => {
    it('should be able to login as an existing user', () => {
        return new Promise((resolve, reject) => {
            const userEmail = 'manningblankenship@quotezart.com'
            server
                .get('/v1/user/login?user=' + userEmail)
                .expect(200)
                .end((err, res) => {
                    if (err) return reject(err)
                    res.status.should.equal(200)
                    res.body.ok.should.ok()
                    res.body.msg.should.equal('User logged in successfully')
                    res.body.token.should.be.type('string')
                    resolve()
                })
        })
    })
    it('should not allow API access without login first')
})
