const supertest = require('supertest')
const should = require('should')
const server = supertest.agent('http://localhost:8000')

describe('Testing functions', () => {
    it('should be able to login as an existing user')
    it('should not allow API access without login first')
})
