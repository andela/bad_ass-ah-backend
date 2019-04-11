import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models/index';
import app from '../index';

chai.use(chaiHttp);
chai.should();
const User = models.user;

dotenv.config();
// eslint-disable-next-line no-unused-vars
const secretKey = process.env.secretOrKey;
// eslint-disable-next-line no-unused-vars
const expirationTime = { expiresIn: '50day' };

describe('/api/users/password', () => {
  describe('POST reset password', () => {
    const newUser = {
      email: 'bienaime.fabrice@andela.com',
      username: 'copain2',
      password: '1Kig1L@20',
    };
    const wrongEmail = 'bienaimefabrice@andela.com';
    before(async () => {
      try {
        await User.destroy({
          where: {
            email: newUser.email
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    });
    before((async () => {
      try {
        return User.create(newUser);
      } catch (error) {
        throw error;
      }
    }));
    describe('send an incorrect email', () => {
      const status = 404;
      it(`return status ${status}`, (done) => {
        chai.request(app)
          .post('/api/users/password')
          .send({
            email: wrongEmail
          })
          .end((err, res) => {
            res.should.have.status(status);
            done();
          });
      });
    });
    describe('POST/ check is an email exist', () => {
      it('should return a message when a password was reset', (done) => {
        chai.request(app)
          .post('/api/users/password')
          .send({ email: 'bienaime.fabrice@andela.com' })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(200);
            res.should.be.an('object');
            done();
          });
      }).timeout(20000);
    });
    describe('PUT/ reset password', () => {
      it('should return a message when a password was reset', (done) => {
        chai.request(app)
          .put('/api/users/password')
          .send({
            token: jwt.sign({ email: newUser.email }, secretKey, { expiresIn: '50d' }),
            password: '1KigAnd98'
          })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(200);
            res.should.be.an('object');
            // console.log(res);
            done();
          });
      });
      it('should return invalid token', (done) => {
        chai.request(app)
          .put('/api/users/password')
          .send({
            token: 'haohdaohiue',
            password: '1KigAnd98'
          })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(401);
            res.should.be.an('object');
            // console.log(res);
            done();
          });
      });
    });
  });
});
