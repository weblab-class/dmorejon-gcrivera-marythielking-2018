const chai = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

describe('Review API', () => {

  describe('POST /review', () => {
    //BROKEN
    it('Create a valid review', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id' , body: 'OMG this place was GREAT!!', rating: 5, time:'12-24-1995', user: '456id'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.Equal(res.body.content.greenspace, '123id');
          assert.equal(res.body.content.body, 'OMG this place was GREAT!!');
          assert.equal(res.body.content.rating, 5);
          assert.equal(res.body.content.time, '12-24-1995');
          //check user here?
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a review without a rating', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id' , body: 'OMG this place was GREAT!!', time:'12-24-1995', user: '456id'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a review without a body', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id', rating: 4, time:'12-24-1995', user: '456id'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a blank review', (done) => {
      request(app)
        .post('/review')
        .send({})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
    //BROKEN
    it('Multiple reviews for same greenspace by one user', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id' ,rating:1, body: 'OMG this place was not too good!!', time:'12-24-1995', user: '456id'})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'User has already written review.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

  });
});
