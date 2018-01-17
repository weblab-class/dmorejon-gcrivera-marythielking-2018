const chai = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

describe('Greenspace API', () => {

  describe('POST /greenspace', () => {

    it('Create a valid greenspace', (done) => {
      request(app)
        .post('/greenspace')
        .send({location: [-73.240813, -62.833790], name: 'Penguin Party Space'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.deepEqual(res.body.content.location, [-73.240813, -62.833790]);
          assert.equal(res.body.content.name, 'Penguin Party Space');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a greenspace without a location', (done) => {
      request(app)
        .post('/greenspace')
        .send({name: 'Central Park'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Greenspace validation failed: location: Path `location` is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a greenspace without a name', (done) => {
      request(app)
        .post('/greenspace')
        .send({location: [-73.240813, -62.833790]})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Greenspace validation failed: name: Path `name` is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a greenspace without a unique name', (done) => {
      request(app)
        .post('/greenspace')
        .send({name: 'Penguinz Party Space', location: [-73.240813, -62.833790]})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'E11000 duplicate key error collection: greenspace.greenspaces index: location_1 dup key: { : -73.240813 }');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});