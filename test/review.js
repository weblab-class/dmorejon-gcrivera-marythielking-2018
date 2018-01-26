const chai = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}
const greenspace1 = {location: [29.004612, 35.277791], name: 'Barely Green', _id: mongoose.Types.ObjectId('besttestid12'), _arraySignature: '123'};
const greenspace2 = {location: [32.015199, 35.277791], name: 'Disputed Turf', _id: mongoose.Types.ObjectId('testtestid23'), _arraySignature: '456'};
const greenspace3 = {location: [30.696969, 21.696969], name: 'Happy Greenspace', _id: mongoose.Types.ObjectId('456id1234567'), _arraySignature: '567'};
const greenpsace4 = {location: [15.123456, 17.123480], name: 'Sad Greenspace', _id: mongoose.Types.ObjectId('123id4567890'), _arraySignature: '789'};

describe('Review API', () => {

  before((done) => {
    request(app)
      .post('/review')
      .send({greenspace: greenspace1 , body: 'This is a positive review, I think.', rating: 4, time: new Date(2005,10,9)})
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
      .send({greenspace: greenspace2 , body: 'This is a negative review, I believe.', rating: 2, time: new Date(2007,9,6)})
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
        .send({greenspace: greenspace3 , body: 'OMG this place was GREAT!!', rating: 5, time: new Date(1995,12,24)})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.greenspace.name, 'Happy Greenspace');
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
        .send({greenspace: greenspace2 , body: 'OMG this place was GREAT!!', time: Date(2007,9,6)})
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
        .send({greenspace: greenspace2, rating: 4, time: Date(2007,9,6)})
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
        .send({greenspace: greenspace1, rating: 1, body: 'OMG this place was not too good!!', time: Date(2007,9,6)})
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
        .get('/review/greenspace/'+ 'besttestid12')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.reviews[0].rating, 4);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get reviews for fake greenspace', (done) => {
      request(app)
        .get('/review/greenspace/'+ 'fakegreenspa')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.reviews.length, 0);
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
          .send({greenspace: '456id1234567'})
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
          .send({greenspace: 'green4691234'})
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
