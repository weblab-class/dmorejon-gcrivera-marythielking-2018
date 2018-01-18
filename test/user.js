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
                                        displayname: 'Cody Maverick'});
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

  describe('PUT /user', () => {

    afterEach(async () => {
      try {
        await userModel.findOneAndRemove({fbid: '247833829183'});
        return;
      } catch(e) {
        return e;
      }
    });

    it('Edit data for a valid user', (done) => {
      request(app)
        .put('/user')
        .send({username: 'surferboi', email: 'bigz4lyfe@penguin.com'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.username, 'surferboi');
          assert.equal(res.body.content.fbid, '247833829183');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Edit data for an invalid user', (done) => {
      request(app)
        .put('/user')
        .send({username: 'surferboi', email: 'bigz4lyfe@penguin.com'})
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'User does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Edit data with missing username', (done) => {
      request(app)
        .put('/user')
        .send({email: 'bigz4lyfe@penguin.com'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Username is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Edit data with missing username', (done) => {
      request(app)
        .put('/user')
        .send({username: 'surferboi'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Email is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});