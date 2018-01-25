const chai = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

let barelyGreenID;
const badID = mongoose.Types.ObjectId("112222222222");

describe('Greenspace API', () => {

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [29.004612, 35.277791], name: 'Barely Green'})
      .end((err, res) => {
        if (err) done(err);
        else {
          barelyGreenID = res.body.content._id;
          done();
        }
      });
  });

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [32.015199, 35.277791], name: 'Disputed Turf'})
      .end((err, res) => {
        if (err) done(err);
        else done();
      });
  });

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [36.136800, 37.155779], name: 'Johnson Field'})
      .end((err, res) => {
        if (err) done(err);
        else done();
      });
  });

  describe('GET /greenspace', () => {

    it('Get data for a valid greenspace', (done) => {
      request(app)
        .get('/greenspace/' + barelyGreenID)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.deepEqual(res.body.content.location, [29.004612, 35.277791]);
          assert.equal(res.body.content.name, 'Barely Green');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get data for an invalid greenspace', (done) => {
      request(app)
        .get('/greenspace/' + badID)
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Greenspace does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get data for an invalid ID', (done) => {
      request(app)
        .get('/greenspace/1')
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Cast to ObjectId failed for value "1" at path "_id" for model "Greenspace"');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get list of greenspaces', (done) => {
      request(app)
        .get('/greenspace/29/37/35/38')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 3);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get another list of greenspaces', (done) => {
      request(app)
        .get('/greenspace/30/37/35/38')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get empty list of greenspaces', (done) => {
      request(app)
        .get('/greenspace/1/5/1/5')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 0);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

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

    it('Create a greenspace without a unique location', (done) => {
      request(app)
        .post('/greenspace')
        .send({name: 'Penguinz Party Space', location: [-73.240813, -62.833790]})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.isDefined(res.body.err);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});
