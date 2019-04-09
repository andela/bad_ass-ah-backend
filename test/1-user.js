import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  signup1,
  signup3,
  signup4,
  login1,
  login2,
  login3,
  googleInValidToken,
  googleValidToken,
  expiredToken,
  invalidToken
} from '../testingdata/user.json';
import models from '../models/index';

const validToken = {
  access_token:
    'EAAgbksnPT5IBAI2f478gPi5HZC9iAvldAtZCKhDPXaZCt0cTEr9kuDbETW1wZCDF17alOnG7qdKZB14O4rr2zg6gtkuU6Q14G9idx1JOZAHcFgtQam72PoBzvjgyyl1BxgiFGMHOwVGVPi23QilFQ1z2hUJCYCHyBYT6qfsfCmFwZDZD'
};
chai.use(chaiHttp);
chai.should();
const User = models.user;

describe('User ', () => {
  before(async () => {
    await User.destroy({ where: { email: signup1.email } });
    await User.destroy({ where: { email: 'pacifiqueclement@gmail.com' } });
    await User.destroy({ where: { email: 'jeandedieuam@gmail.com' } });
  });
  it('Should create user and return status of 201', (done) => {
    chai
      .request(app)
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
    chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup1)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(409);
        res.should.have.property('error');
        done();
      });
  });
  // @when_its_time_its_time username is not assigned from req.body
  it('Should return status of 500', (done) => {
    chai
      .request(app)
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

  // user login

  // it('should login user', (done) => {
  //   chai
  //     .request(app)
  //     .post('/api/users/login')
  //     .set('Content-Type', 'application/json')
  //     .send(login1)
  //     .send(googleValidToken)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       res.should.have.status(200);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('status').eql(200);
  //       res.body.should.have.property('token');
  //       res.body.should.have.property('user');
  //       done();
  //     });
  // });

  it('should return an error if credentials are not correct', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(login2)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(400);
        res.body.should.have
          .property('error')
          .eql('Incorrect username or password');
        done();
      });
  });

  it('Should return status of 500', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(login3)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });

  // it('Should signup user via google', (done) => {
  //   chai.request(app)
  //     .post('/api/users/login/google')
  //     .set('Content-Type', 'application/json')
  //     .send(googleValidToken)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       res.should.have.status(200);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('status').eql(200);
  //       res.body.should.have.property('token');
  //       res.body.should.have.property('user');
  //       done();
  //     });
  // });

  // it('Should login user via google', (done) => {
  //   chai.request(app)
  //     .post('/api/users/login/google')
  //     .set('Content-Type', 'application/json')
  //     .send(googleValidToken)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       res.should.have.status(200);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('status').eql(200);
  //       res.body.should.have.property('token');
  //       res.body.should.have.property('user');
  //       done();
  //     });
  // });

  it('Should return 401 if the token is not valid', (done) => {
    chai.request(app)
      .post('/api/users/login/google')
      .set('Content-Type', 'application/json')
      .send(googleInValidToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(401);
        done();
      });
  });
  // @ Should let the user signup using facebook
  it('Should not let the user signup via facebook with a expired token', (done) => {
    chai
      .request(app)
      .post('/api/users/auth/facebook')
      .send(expiredToken)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(401);
        // res.body.should.have.property('token');
        // res.body.should.have.property('user');
        done();
      });
  });
  it('Should not let the user signup via facebook with an invalid token', (done) => {
    chai
      .request(app)
      .post('/api/users/auth/facebook')
      .send(invalidToken)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(500);
        done();
      });
  });
  it('Should let the user signup with facebook', (done) => {
    chai
      .request(app)
      .post('/api/users/auth/facebook')
      .set('Content-Type', 'application/json')
      .send(validToken)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        done();
      });
  });
  it('Should let the user login with facebook', (done) => {
    chai
      .request(app)
      .post('/api/users/auth/facebook')
      .set('Content-Type', 'application/json')
      .send(validToken)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        done();
      });
  });
});
