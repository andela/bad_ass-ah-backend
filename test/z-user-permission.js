/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  login1,
  login6,
} from '../testingdata/user.json';
import models from '../models/index';

const User = models.user;
chai.use(chaiHttp);
chai.should();
let token2;
let userId;
let userId2;
let token1;
describe('User Permission', () => {
  before(async () => {
    await User.update({ isActivated: true }, { where: { email: login1.email } });
    const login = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login6);
    const notAdmin = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login1);
    token2 = `Bearer ${login.body.token}`;
    token1 = `Bearer ${notAdmin.body.token}`;
    userId2 = login.body.user.id;
    userId = notAdmin.body.user.id;
  });
  // @check giving user permission
  it('PUT /api/users/access/:userId  should return status of 200', (done) => {
    chai.request(app)
      .put(`/api/users/access/${userId}`)
      .set('Authorization', token2)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
  });
  // return status of 403
  it('PUT /api/users/access/:userId  should return status of 403, when user dont have access ',
    (done) => {
      chai.request(app)
        .put(`/api/users/access/${userId2}`)
        .set('Authorization', token2)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(403);
          res.body.should.have.property('message');
          done();
        });
    });
  // @check account activation
  it('PUT /api/users/availability/:userId  should return status of 403 When user is an admin or manager', (done) => {
    chai.request(app)
      .put(`/api/users/availability/${userId}`)
      .set('Authorization', token2)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(403);
        res.body.should.have.property('message');
        done();
      });
  });
  it('PUT /api/users/availability/:userId  should return status of 403 When user is not an admin or manager', (done) => {
    chai.request(app)
      .put(`/api/users/availability/${userId2}`)
      .set('Authorization', token1)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(403);
        res.body.should.have.property('message');
        done();
      });
  });
});
