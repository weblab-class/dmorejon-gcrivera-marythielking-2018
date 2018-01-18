const chai = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const userModel = require('../models/user').userModel;

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

describe('User API', () => {

  describe('GET /user', () => {

    afterEach(async () => {
      try {
        const newUser = new userModel({fbid: '247833829183',
                                        displayname: 'Cody Maverick',
                                        photo: 'https://pbs.twimg.com/profile_images/491641114534117378/rcXXFash_400x400.jpeg'});
        await newUser.save()
        return;
      } catch(e) {
        return e;
      }
    });

    it('Get data for an invalid user', (done) => {
      request(app)
        .get('/user')
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'User not found.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get data for a valid user', (done) => {
      request(app)
        .get('/user')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.displayname, 'Cody Maverick');
          assert.equal(res.body.content.fbid, '247833829183');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});