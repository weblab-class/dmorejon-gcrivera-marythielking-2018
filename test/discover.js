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

let kresge;
let killian;
let cutler;

describe('Discover API', () => {

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [42.358356, -71.094476], name: 'Kresge', tags: ['green', 'field', 'sports']})
      .end((err, res) => {
        if (err) done(err);
        else {
          kresge = res.body.content;
          kresge.location = kresge.location.coordinates;
          done();
        }
      });
  });

  before(async () => {
    try {
      const newUser = new userModel({fbid: 10211342727149288,
                                      displayname:'Gabrielle Rivera',
                                      photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
                                      tags: ['dogs', 'hiking', 'soccer', 'field'],
                                      favorites: [kresge]});
      await newUser.save();
      return;
    } catch(e) {
      throw e;
    }
  });

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [42.359057, -71.091551], name: 'Killian', tags: ['green', 'field', 'sports']})
      .end((err, res) => {
        if (err) done(err);
        else {
          killian = res.body.content;
          killian.location = killian.location.coordinates;
          done();
        }
      });
  });

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [42.283229, -71.198426], name: 'Cutler Park Reservation', tags: ['park', 'green', 'hiking']})
      .end((err, res) => {
        if (err) done(err);
        else {
          cutler = res.body.content;
          cutler.location = cutler.location.coordinates;
          done();
        }
      });
  });

  before((done) => {
    request(app)
      .post('/greenspace')
      .send({location: [35.989898, -111.926671], name: 'Grand Canyon', tags: ['hiking', 'park', 'canyon']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 14);
    request(app)
      .post('/event')
      .send({name: 'Soccer', greenspace: kresge, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['soccer', 'field', 'team']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 16);
    request(app)
      .post('/event')
      .send({name: 'Football', greenspace: kresge, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['football', 'field', 'team']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 15);
    request(app)
      .post('/event')
      .send({name: 'Frisbee', greenspace: killian, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['frisbee', 'field', 'fun']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 17);
    request(app)
      .post('/event')
      .send({name: 'Dog Playdate', greenspace: killian, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['dogs', 'field', 'fun']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 19);
    request(app)
      .post('/event')
      .send({name: 'Trail walk', greenspace: cutler, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['trail', 'hiking', 'group']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  before((done) => {
    const d = new Date();
    const starttime = d.setFullYear(2018, 2, 21);
    request(app)
      .post('/event')
      .send({name: 'Hiking with dogs', greenspace: cutler, starttime: starttime,
              endtime: starttime + 180000, pending: [], tags: ['trail', 'hiking', 'dogs']})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  describe('GET /discover', () => {

    it('Test discover', (done) => {
      request(app)
        .get('/discover/' + [42.356769, -71.096078].toString())
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.content.length, 3);
          assert.equal(res.body.content[0].greenspace.name, 'Killian');
          assert.equal(res.body.content[0].events.length, 2);
          assert.equal(res.body.content[0].events[0].name, 'Frisbee');
          assert.equal(res.body.content[1].greenspace.name, 'Kresge');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});