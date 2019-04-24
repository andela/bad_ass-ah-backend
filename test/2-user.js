/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../index';
import {
  signup1,
  signup3,
  signup4,
  signup5,
  signup7,
  login1,
  login2,
  login3,
  login4,
  googleInValidToken,
  googleValidToken,
  expiredToken,
  invalidToken,
  validToken,
  profile1,
  testMailer,
  userTwitterSignup
} from '../testingdata/user.json';
import models from '../models/index';
import userController from '../controllers/user';

chai.use(chaiHttp);
chai.should();
const User = models.user;
let token;
let token2;
let userId;
describe('User ', () => {
  before(async () => {
    await User.destroy({ where: { email: signup1.email } });
    await User.destroy({ where: { email: signup5.email } });
    await User.destroy({ where: { email: signup7.email } });
    await User.destroy({ where: { email: 'pacifiqueclement@gmail.com' } });
    await User.destroy({ where: { email: 'jeandedieuam@gmail.com' } });
    // @create user
    User.create({
      username: signup7.username,
      email: signup7.email,
      password: bcrypt.hashSync(signup7.password, 10),
      isAdmin: signup7.isAdmin,
      isManager: signup7.isManager,
      isActivated: true
    });
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
        res.body.registeredUser.should.have.property('token');
        res.body.registeredUser.should.have.property('username');
        done();
      });
  }).timeout(20000);
  // @second user
  it('Should create user and return status of 201', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(signup5)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.registeredUser.should.have.property('token');
        res.body.registeredUser.should.have.property('username');
        done();
      });
  }).timeout(50000);
  //
  it('Should return status of 409', (done) => {
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
        res.should.have.status(400);
        res.should.have.property('error');
        done();
      });
  });

  // user login
  it('should return error verify email account before login', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(login1)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(403);
        res.body.should.be.an('object');
        done();
      });
  });
  it('should login user', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: testMailer.email, password: testMailer.password })
      .send(googleValidToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        token = `Bearer ${res.body.token}`;
        userId = res.body.user.id;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        done();
      });
  });
  // user login2
  it('POST /api/users/login Should login for second user as admin', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(signup7)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        token2 = `Bearer ${res.body.token}`;
        userId = res.body.user.id;
        res.should.have.status(200);
        done();
      });
  });

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

  it('Should signup user via google', (done) => {
    chai.request(app)
      .post('/api/users/login/google')
      .set('Content-Type', 'application/json')
      .send(googleValidToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        done();
      });
  });

  it('Should login user via google', (done) => {
    chai.request(app)
      .post('/api/users/login/google')
      .set('Content-Type', 'application/json')
      .send(googleValidToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        done();
      });
  });

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
  it('Should let the user signup with twitter', async () => {
    const result = await userController.twitterLogin(userTwitterSignup);
    result[0].dataValues.should.be.a('object');
  });
  // Get all users
  it(' Get /api/users should return status of 403 when user is not admin ', (done) => {
    chai.request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(403);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        done();
      });
  });
  it(' Get /api/users should return status of 200 when user is admin ', (done) => {
    chai.request(app)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('status');
        done();
      });
  });
  // profile
  it('Should return 400 if the user ID is not an integer', (done) => {
    chai.request(app)
      .get('/api/users/id/profile')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('The User ID must be an integer');
        done();
      });
  });

  it('Should return 404 if the user is not found', (done) => {
    const id = 1000000;
    chai.request(app)
      .get(`/api/users/${id}/profile`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('User not found');
        done();
      });
  });

  it('Should get User profile', (done) => {
    User.findOne({ where: { email: testMailer.email } })
      .then((user) => {
        if (user) {
          chai.request(app)
            .get(`/api/users/${user.id}/profile`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .end((err, res) => {
              if (err) {
                done(err);
              }
              res.should.have.status(200);
              res.body.should.have.property('status').eql(200);
              res.body.should.have.property('profile');
              res.body.profile.should.be.a('object');
              done();
            });
        }
      }).catch(err => console.log(err));
  });

  it('Should update User profile', (done) => {
    chai.request(app)
      .put('/api/users/profile')
      .set('Content-Type', 'multipart/form-data')
      .field('username', profile1.username)
      .field('bio', profile1.bio)
      .attach('image', profile1.image)
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('profile');
        res.body.profile.should.be.a('object');
        done();
      });
  });

  it('Should return 400 if the username is empty', (done) => {
    chai.request(app)
      .put('/api/users/profile')
      .set('Content-Type', 'multipart/form-data')
      .field('username', '')
      .field('bio', profile1.bio)
      .attach('image', profile1.image)
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Please provide a username');
        done();
      });
  });
});
