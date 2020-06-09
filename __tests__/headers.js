const request = require('supertest');
// const { describe, it } = require('mocha');
const should = require('should');
const app = require('../app');

it('Cors Headers', function (done) {
	request(app)
		.get('/health')
		.set('Accept', 'application/json')
		.expect('Access-Control-Allow-Origin', '*')
		.expect('Access-Control-Allow-Methods', '*')
		.expect('Access-Control-Allow-Credentials', 'true')
		.expect('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token')
		.expect('Access-Control-Expose-Headers', '*')
		.expect(200,done)
});