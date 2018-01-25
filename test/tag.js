const chai = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

describe('Tag API', () => {

  describe('POST /tag', () => {

    it('Create a valid tag', (done) => {
      request(app)
        .post('/tag')
        .send({name: 'hiking'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.name, 'hiking');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create another valid tag', (done) => {
      request(app)
        .post('/tag')
        .send({name: 'hunting'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.name, 'hunting');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create another valid tag', (done) => {
      request(app)
        .post('/tag')
        .send({name: 'field hockey'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.name, 'field hockey');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create another valid tag', (done) => {
      request(app)
        .post('/tag')
        .send({name: 'Running'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.name, 'running');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Create a tag without a name', (done) => {
      request(app)
        .post('/tag')
        .send({})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Tag validation failed: name: Path `name` is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

  describe('GET /tag', () => {

    it('Get data for a valid tag', (done) => {
      request(app)
        .get('/tag/hiking')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content[0].name, 'hiking');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get tags with an H', (done) => {
      request(app)
        .get('/tag/H')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 3)
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get tag with a un', (done) => {
      request(app)
        .get('/tag/un')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 2)
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get tags with a ing', (done) => {
      request(app)
        .get('/tag/Ing')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 3)
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});