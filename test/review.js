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

  before((done) => {
    request(app)
      .post('/review')
      .send({greenspace: 'green479' , body: 'This is a positive review, I think.', rating: 4, time: new Date(2005,10,9)})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    request(app)
      .post('/review')
      .send({greenspace: 'green478' , body: 'This is a negative review, I believe.', rating: 2, time: new Date(2007,9,6)})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  describe('POST /review', () => {

    it('Create a valid review', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id' , body: 'OMG this place was GREAT!!', rating: 5, time: new Date(1995,12,24)})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.greenspace, '123id');
          assert.equal(res.body.content.body, 'OMG this place was GREAT!!');
          assert.equal(res.body.content.rating, 5);
          assert.equal(res.body.content.time.value, Date(12,24,1995).value);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a review without a rating', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id' , body: 'OMG this place was GREAT!!', time: Date(2007,9,6)})
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
        .send({greenspace: '123id', rating: 4, time: Date(2007,9,6)})
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

    it('Multiple reviews for same greenspace by one user', (done) => {
      request(app)
        .post('/review')
        .send({greenspace: '123id', rating: 1, body: 'OMG this place was not too good!!', time: Date(2007,9,6)})
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

  describe('GET /review/', () => {

    it('Get reviews by a single user', (done) => {
      request(app)
        .get('/review/user')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content[0].rating, 2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get reviews by greenspace', (done) => {
      request(app)
        .get('/review/greenspace/'+ '123id')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.reviews[0].rating, 5);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get reviews for fake greenspace', (done) => {
      request(app)
        .get('/review/greenspace/'+ 'fakegreenspacenameLOLOLOLOLGETPLAYEDBOI')
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'There are no reviews for this green space.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

    describe('DELETE /review', () => {

      it('Delete review by a valid user', (done) => {
        request(app)
          .delete('/review')
          .send({greenspace: 'green479'})
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect((res) => {
            assert.equal(res.body.success, true);
          })
          .end((err, res) => {
            if (err) done(err);
            else done();
          });
      });


      it('Delete review by an invalid user', (done) => {
        request(app)
          .delete('/review')
          .send({greenspace: 'green469'})
          .expect(404)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect((res) => {
            assert.equal(res.body.success, false);
            assert.equal(res.body.err, "Review does not exist for this user")
          })
          .end((err, res) => {
            if (err) done(err);
            else done();
          });
      });


    });
  });
