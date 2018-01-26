const chai = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

const user1 = { _id: '5a63c29174d39b08342a5969',
  fbid: 10211342727149269,
  displayname: 'Cody Maverick',
  photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
  };
const user2 = { _id: '5a63c29174d39b08342a5420',
  fbid: 10211342727149420,
  displayname: 'Tank Evans',
  photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
  };
const badID = mongoose.Types.ObjectId("222222222222");
let snowballFightID;
let africanSafariID;
const greenspace1 = {location: [29.004612, 35.277791], name: 'Barely Green', _id: mongoose.Types.ObjectId('besttestid12'), _arraySignature: '123'};
const greenspace2 = {location: [32.015199, 35.277791], name: 'Disputed Turf', _id: mongoose.Types.ObjectId('testtestid23'), _arraySignature: '456'};
const greenspace3 = {location: [30.696969, 21.696969], name: 'Happy Greenspace', _id: mongoose.Types.ObjectId('456id1234567'), _arraySignature: '567'};
const greenspace4 = {location: [15.123456, 17.123480], name: 'Sad Greenspace', _id: mongoose.Types.ObjectId('123id4567890'), _arraySignature: '789'};


describe('Event API', () => {

  before((done) => {
    request(app)
      .post('/event')
      .send({name: 'Snowball Fight', greenspace: greenspace1, starttime: Date.now(),
              endtime: Date.now() + 180000, participants: [user1, user2], tags: ['ice', 'cold']})
      .end((err, res) => {
        if (err) done(err);
        else {
          snowballFightID = res.body.content._id;
          done();
        }
      });
  });

  before((done) => {
    request(app)
      .post('/event')
      .send({name: 'Penguin Party', greenspace: greenspace1, starttime: Date.now() + 1800000,
              endtime: Date.now() + 1803000, participants: [user1, user2], tags: ['birds', 'flightless'],
              description: 'Come party with the penguins.'})
      .end((err, res) => {
        if (err) done(err);
        else {
          done();
        }
      });
  });

  describe('GET /event', () => {

    it('Get data for a valid event', (done) => {
      request(app)
        .get('/event/' + snowballFightID)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.name, 'Snowball Fight');
          assert.equal(res.body.content.greenspace.name, 'Barely Green');
          assert.deepEqual(res.body.content.tags, ['ice', 'cold']);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get data for an invalid event', (done) => {
      request(app)
        .get('/event/' + badID)
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Event does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get events for valid greenspace and check sorting', (done) => {
      request(app)
        .get('/event/greenspace/' + 'besttestid12')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 2);
          assert.equal(res.body.content[0].name, 'Snowball Fight');
          assert.equal(res.body.content[0].greenspace.name, 'Barely Green');
          assert.equal(res.body.content[1].name, 'Penguin Party');
          assert.equal(res.body.content[1].greenspace.name, 'Barely Green');
          assert.deepEqual(res.body.content[1].tags, ['birds', 'flightless']);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get events for greenspace with no events', (done) => {
      request(app)
        .get('/event/greenspace/' + '121314151617')
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

    it('Get events for invalid greenspace', (done) => {
      request(app)
        .get('/event/greenspace/121314151617')
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

    it('Get events for valid user and check sorting', (done) => {
      request(app)
        .get('/event/user/')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 2);
          assert.equal(res.body.content[0].name, 'Snowball Fight');
          assert.equal(res.body.content[0].greenspace.name, 'Barely Green');
          assert.equal(res.body.content[1].name, 'Penguin Party');
          assert.equal(res.body.content[1].greenspace.name, 'Barely Green');
          assert.deepEqual(res.body.content[1].tags, ['birds', 'flightless']);

        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

  describe('POST /event', () => {

    it('Create a valid event and optionally test expiry *BE PREPARED TO WAIT*', (done) => {
      request(app)
        .post('/event')
        .send({name: 'African Safari', greenspace: greenspace2, starttime: Date.now(),
                endtime: Date.now() + 2000, participants: [user1, user2],
                description: 'Avoid the hippos.'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          africanSafariID = res.body.content._id;
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.name, 'African Safari');
          assert.equal(res.body.content.greenspace.name, 'Disputed Turf');
          assert.equal(res.body.content.participants.length, 3);
          assert.equal(res.body.content.tags.length, 0);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
          // Uncomment code below to test event expiry
          // else {
          //   setTimeout(() => {
          //     console.log('here')
          //     request(app)
          //       .get('/event/' + africanSafariID)
          //       .expect(404)
          //       .expect('Content-Type', 'application/json; charset=utf-8')
          //       .expect((res) => {
          //         assert.equal(res.body.success, false);
          //         assert.equal(res.body.err, 'Event does not exist.');
          //       })
          //       .end((err, res) => {
          //         if (err) done(err);
          //         else done();
          //       })
          //   }, 80000);
          // }
        });
    });

    it('Create an event without a name', (done) => {
      request(app)
        .post('/event')
        .send({greenspace: greenspace3, starttime: Date.now(),
                endtime: Date.now() + 2000, participants: [user1, user2]})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Event validation failed: name: Path `name` is required.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

  describe('PUT /event', () => {

    it('Edit a valid event', (done) => {
      request(app)
        .put('/event/' + snowballFightID)
        .send({name: 'Snowball Fight', greenspace: greenspace2, starttime: Date.now(),
                endtime: Date.now() + 180000, participants: [user1, user2],
                description: 'Icy'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.name, 'Snowball Fight');
          assert.equal(res.body.content.description, 'Icy');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Edit an invalid event', (done) => {
      request(app)
        .put('/event/' + badID)
        .send({name: 'Snowball Fight', greenspace: greenspace4, starttime: Date.now(),
                endtime: Date.now() + 180000, participants: [user1, user2],
                description: 'Icy'})
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Event does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Join a valid event', (done) => {
      request(app)
        .put('/event/join/' + snowballFightID)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.host.fbid, 10211342727149288);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Join an invalid event', (done) => {
      request(app)
        .put('/event/join/' + badID)
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.include(res.body.err, 'Event does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Leave a valid event', (done) => {
      request(app)
        .put('/event/leave/' + snowballFightID)
        .send({target: user2})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.notInclude(res.body.content.participants, user2);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Leave an invalid event', (done) => {
      request(app)
        .put('/event/leave/' + badID)
        .send({target: user1})
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Event does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Have host leave event', (done) => {
      request(app)
        .put('/event/leave/' + snowballFightID)
        .send({target: {_id: '5a63c29174d39b08342a59e2',
        fbid: 10211342727149288,
        displayname: 'Gabrielle Rivera',
        photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
        __v: 0 }})
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Host cannot leave event.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Have participant (not host) try to remove another participant', (done) => {
      request(app)
        .put('/event/leave/' + snowballFightID)
        .send({target: user1})
        .expect(403)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'User does not have permission to remove specified user from event.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });

  describe('DELETE /event', () => {

    it('Delete a valid event', (done) => {
      request(app)
        .delete('/event/' + snowballFightID)
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

    it('Delete an invalid event', (done) => {
      request(app)
        .delete('/event/' + badID)
        .expect(404)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, false);
          assert.equal(res.body.err, 'Event does not exist.');
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });
  });
});
