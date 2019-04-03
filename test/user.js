import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  signup1, signup2, signup3, signup4
} from '../testingdata/user.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();
const User = models.user;

describe('User ', () => {
  let verifyLinkToken;
  before(async () => {
    await User.destroy({ where: { email: signup1.email } });
  });
  it('Should create user and return status of 201', (done) => {
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup1)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.should.have.property('token');
        res.body.should.have.property('username');
        done();
      });
  }).timeout(20000);
  it('Should return status of 400', (done) => {
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup1)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.should.have.property('error');
        done();
      });
  });
  it('Should return status of 400', (done) => {
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup2)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.should.have.property('error');
        done();
      });
  });
  // @when username is available in our database
  it('Should return status of 400', (done) => {
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup3)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.should.have.property('error');
        done();
      });
  });
  // @when username is not assigned from req.body
  it('Should return status of 500', (done) => {
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup4)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        res.should.have.property('error');
        done();
      });
  });
});
