import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer } from '../testingdata/user.json';
import { article1 } from '../testingdata/article.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();
const { user, rate, article } = models;

describe('Email Verification Link', () => {
  let verifyLinkToken;
  before(async () => {
    try {
      await rate.destroy({ where: {}, truncate: true });
      await article.destroy({ where: { title: article1.title } });
      await user.destroy({ where: { email: testMailer.email } });
    } catch (error) {
      throw new Error(error);
    }
  });
  describe('POST/ Send verification link', () => {
    const data = {
      token: 'fake token'
    };
    it('Should create a new user', (done) => {
      chai.request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(testMailer)
        .end((err, res) => {
          if (err) done(err);
          verifyLinkToken = res.body.token;
          res.should.have.status(201);
          res.body.should.have.property('token');
          res.body.should.have.property('username');
          done();
        });
    }).timeout(20000);
    it('Should return error valid token is required', (done) => {
      chai.request(app)
        .post('/api/users/send-verification-link')
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('object');
          done();
        });
    });
    it('Should send verification link', (done) => {
      data.token = verifyLinkToken;
      chai.request(app)
        .post('/api/users/send-verification-link')
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('response');
          done();
        });
    }).timeout(20000);
  });
  describe('GET/ Activate User Account', () => {
    it('Should activate user account', (done) => {
      chai.request(app)
        .get(`/api/users/verify/${verifyLinkToken}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('isActivated').equal(true);
          done();
        });
    });
    it('Should return error token is expired or invalid', (done) => {
      chai.request(app)
        .get('/api/users/verify/FakeTokenOrInvalid')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
