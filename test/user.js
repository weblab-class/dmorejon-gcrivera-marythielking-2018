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

    before(async () => {
      try {
        const newUser = new userModel({fbid: '247833829184',
                                        displayname: 'Chicken Joe',
                                        photo: 'https://vignette.wikia.nocookie.net/p__/images/6/6f/E3319ee4080620c620b19f6dd957b119.jpg/revision/latest?cb=20170915211728&path-prefix=protagonist'});
        await newUser.save()
        return;
      } catch(e) {
        return e;
      }
    });

    before(async () => {
      try {
        const newUser = new userModel({fbid: '247833829185',
                                        displayname: 'Cotank Rjoevans',
                                        photo: 'https://vignette.wikia.nocookie.net/sonypicturesanimation/images/2/25/Tank_evens2.png/revision/latest?cb=20170602010041'});
        await newUser.save()
        return;
      } catch(e) {
        console.log(e)
        return e;
      }
    });

    before(async () => {
      try {
        const newUser = new userModel({fbid: '247833829186',
                                        displayname: 'Geek Crust',
                                        photo: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTM1NjA2NjAxMF5BMl5BanBnXkFtZTcwNTgzODYzMw@@._V1_SY1000_CR0,0,1659,1000_AL_.jpg'});
        await newUser.save()
        return;
      } catch(e) {
        return e;
      }
    });

    afterEach(async () => {
      try {
        const newUser = new userModel({fbid: 10211342727149288,
        displayname: 'Cody Maverick',
        photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901'});
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
          assert.equal(res.body.content.fbid, '10211342727149288');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get users with a C', (done) => {
      request(app)
        .get('/user/C')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 4);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get users with a joe', (done) => {
      request(app)
        .get('/user/joe')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get users with a co', (done) => {
      request(app)
        .get('/user/Co')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.length, 2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

  describe('PUT /user', () => {

    it('Add a tag to a user', (done) => {
      request(app)
        .put('/user/tag/create')
        .send({name: 'Hiking'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.fbid, 10211342727149288);
          assert.equal(res.body.content.tags[0], 'hiking');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Add a tag to a user', (done) => {
      request(app)
        .put('/user/tag/create')
        .send({name: 'soccer'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.fbid, 10211342727149288);
          assert.equal(res.body.content.tags.length, 2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Add a tag without a name to a user', (done) => {
      request(app)
        .put('/user/tag/create')
        .send()
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Tag name is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Remove a tag from a user', (done) => {
      request(app)
        .put('/user/tag/delete')
        .send({name: 'hiking'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.fbid, 10211342727149288);
          assert.equal(res.body.content.tags.length, 1);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Remove a tag without a name from a user', (done) => {
      request(app)
        .put('/user/tag/delete')
        .send()
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Tag name is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

});