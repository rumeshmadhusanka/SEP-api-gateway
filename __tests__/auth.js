const request = require('supertest');
// const { describe, it } = require('mocha');
const should = require('should');
const app = require('../app');

it('Default Route check', function (done) {
	request(app)
		.get('/')
		.expect(302, done)

});


it('Get blacklist', function (done) {
	request(app)
		.get('/iplist/blacklist')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.expect('Content-Type', /json/)
		.expect(200, done);
});
it('Get whitelist', function (done) {
	request(app)
		.get('/iplist/whitelist')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.expect('Content-Type', /json/)
		.expect(200, done);
});
it('Delete whitelist', function (done) {
	request(app)
		.delete('/iplist/whitelist')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.send({ip: '123456789'})
		.expect('Content-Type', /json/)
		.expect(200, done);
});

it('Delete blacklist', function (done) {
	request(app)
		.delete('/iplist/blacklist')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.send({ip: '123456789'})
		.expect('Content-Type', /json/)
		.expect(200, done);
});

it('POST blacklist', function (done) {
	request(app)
		.post('/iplist/blacklist')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.send({ip: '123456789'})
		.expect(201,done)

});
it('POST whitelist', function (done) {
	request(app)
		.post('/iplist/whitelist')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.send({ip: '123456789'})
		.expect('Content-Type', /json/)
		.expect(201)
		.end(function (err, res) {
			if (err) return done(err);
			done();
		});
});

it('check Health', function (done) {
	request(app)
		.get('/health')
		.set('Accept', 'application/json')
		.set('x-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaSIsImlhdCI6MTU5MTY2NTY2OH0.Sl0uuz_TfkIOfIBGm7Q9YjajSHhFlKojZn-jyomAqVg')
		.expect('Content-Type', /json/)
		.expect(200)
		.expect((res) => {
			res.body[0].should.have.property("cpu").and.be.a.Number();
		})
		.end(function (err, res) {
			if (err) return done(err);
			done();
		});
});


