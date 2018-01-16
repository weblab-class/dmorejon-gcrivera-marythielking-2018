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

    it('Create a valid greenspace', async (done) => {
      request(app)
        .post('/greenspace')
        .send({location: [-73.240813, -62.833790], name: 'Penguin Party Space'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.location, [-73.240813, -62.833790]);
          assert.equal(res.body.content.name, 'Penguin Party Space');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});