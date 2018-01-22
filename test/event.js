const chai = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const assert = chai.assert;

// Reset our mongoose collections so that the tests can run successfully.
for (let i in mongoose.connection.collections) {
  mongoose.connection.collections[i].remove(function() {});
}

const greenspaceID = mongoose.Types.ObjectId("112222222222");
const emptyGreenspaceID = mongoose.Types.ObjectId("112222222223");
const userID1 = "247833829180";
const userID2 = "247833829192";
const badID = mongoose.Types.ObjectId("222222222222");
let snowballFightID;
let africanSafariID;

describe('Event API', () => {

  before((done) => {
    request(app)
      .post('/event')
      .send({name: 'Snowball Fight', greenspace: greenspaceID, starttime: Date.now(),
              endtime: Date.now() + 180000, participants: [userID1, userID2]})
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
      .send({name: 'Penguin Party', greenspace: greenspaceID, starttime: Date.now() + 1800000,
              endtime: Date.now() + 1803000, participants: [userID1, userID2],
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
          assert.equal(res.body.content.greenspace, greenspaceID);
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
        .get('/event/greenspace/' + greenspaceID)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.content.length, 2);
          assert.equal(res.body.content[0].name, 'Snowball Fight');
          assert.equal(res.body.content[0].greenspace, greenspaceID);
          assert.equal(res.body.content[1].name, 'Penguin Party');
          assert.equal(res.body.content[1].greenspace, greenspaceID);
        })
        .end((err, res) => {
          if (err) done(err);
          else done();
        });
    });

    it('Get events for greenspace with no events', (done) => {
      request(app)
        .get('/event/greenspace/' + emptyGreenspaceID)
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
        .get('/event/greenspace/1')
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
          assert.equal(res.body.content[0].greenspace, greenspaceID);
          assert.equal(res.body.content[1].name, 'Penguin Party');
          assert.equal(res.body.content[1].greenspace, greenspaceID);
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
        .send({name: 'African Safari', greenspace: greenspaceID, starttime: Date.now(),
                endtime: Date.now() + 2000, participants: [userID1, userID2],
                description: 'Avoid the hippos.'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect((res) => {
          africanSafariID = res.body.content._id;
          assert.equal(res.body.success, true);
          assert.isDefined(res.body.content);
          assert.equal(res.body.content.name, 'African Safari');
          assert.equal(res.body.content.greenspace, greenspaceID);
          assert.include(res.body.content.participants, '247833829183');
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
        .send({greenspace: greenspaceID, starttime: Date.now(),
                endtime: Date.now() + 2000, participants: [userID1, userID2]})
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
  //
  // describe('PUT /event', () => {
  //
  //   it('Edit a valid event', (done) => {
  //     request(app)
  //       .put('/event/' + snowballFightID)
  //       .send({name: 'Snowball Fight', greenspace: greenspaceID, starttime: Date.now(),
  //               endtime: Date.now() + 180000, participants: [userID1, userID2],
  //               description: 'Icy'})
  //       .expect(200)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, true);
  //         assert.equal(res.body.content.name, 'Snowball Fight');
  //         assert.equal(res.body.content.description, 'Icy');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Edit an invalid event', (done) => {
  //     request(app)
  //       .put('/event/' + badID)
  //       .send({name: 'Snowball Fight', greenspace: greenspaceID, starttime: Date.now(),
  //               endtime: Date.now() + 180000, participants: [userID1, userID2],
  //               description: 'Icy'})
  //       .expect(404)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.equal(res.body.err, 'Event does not exist.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Join a valid event', (done) => {
  //     request(app)
  //       .put('/event/join/' + snowballFightID)
  //       .expect(200)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, true);
  //         assert.include(res.body.content.participants, '247833829083');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Join an invalid event', (done) => {
  //     request(app)
  //       .put('/event/join/' + badID)
  //       .expect(404)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.include(res.body.err, 'Event does not exist.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Leave a valid event', (done) => {
  //     request(app)
  //       .put('/event/leave/' + snowballFightID)
  //       .send({target: userID2})
  //       .expect(200)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, true);
  //         assert.notInclude(res.body.content.participants, userID2);
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Leave an invalid event', (done) => {
  //     request(app)
  //       .put('/event/leave/' + badID)
  //       .send({target: userID1})
  //       .expect(404)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.equal(res.body.err, 'Event does not exist.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Have host leave event', (done) => {
  //     request(app)
  //       .put('/event/leave/' + snowballFightID)
  //       .send({target: '247833829183'})
  //       .expect(400)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.equal(res.body.err, 'Host cannot leave event.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Have participant (not host) try to remove another participant', (done) => {
  //     request(app)
  //       .put('/event/leave/' + snowballFightID)
  //       .send({target: userID1})
  //       .expect(403)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.equal(res.body.err, 'User does not have permission to remove specified user from event.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  // });
  //
  // describe('DELETE /event', () => {
  //
  //   it('Delete a valid event', (done) => {
  //     request(app)
  //       .delete('/event/' + snowballFightID)
  //       .expect(200)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, true);
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  //
  //   it('Delete an invalid event', (done) => {
  //     request(app)
  //       .delete('/event/' + badID)
  //       .expect(404)
  //       .expect('Content-Type', 'application/json; charset=utf-8')
  //       .expect((res) => {
  //         assert.equal(res.body.success, false);
  //         assert.equal(res.body.err, 'Event does not exist.');
  //       })
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else done();
  //       });
  //   });
  // });
});
