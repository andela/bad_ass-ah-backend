import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { login1, login4 } from '../testingdata/user.json';

chai.use(chaiHttp);
chai.should();
let token;
let userId;
let userId2;
describe('Followers', () => {
  before(async () => {
    try {
      const login = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login1);
      const login2 = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login4);
      token = `Bearer ${login.body.token}`;
      userId2 = login.body.user.id;
      userId = login2.body.user.id;
    } catch (error) {
      console.log(error);
    }
  });
  // check
  it('Should return status of 404 (follow user)', (done) => {
    chai.request(app)
      .post('/api/users/follow/100005667')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
  // @should return status code of 201
  it('Should return status of 201 (follow user)', (done) => {
    chai.request(app)
      .post(`/api/users/follow/${userId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        //
        res.should.have.status(201);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        done();
      });
  });
  // should return status of 403
  it('Should return status of 403 (follow user)', (done) => {
    chai.request(app)
      .post(`/api/users/follow/${userId2}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        //
        res.should.have.status(403);
        res.body.should.have.property('error');
        res.body.should.have.property('status');
        done();
      });
  });
  // should return status code of 409
  it('Should return status of 409 (follow user)', (done) => {
    chai.request(app)
      .post(`/api/users/follow/${userId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        //
        res.should.have.status(409);
        res.body.should.have.property('error');
        res.body.should.have.property('status');
        done();
      });
  });
  // @should return status code 0f 200 unfollow user
  it('Should return status of 200 unfollow', (done) => {
    chai.request(app)
      .delete(`/api/users/unfollow/${userId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        done();
      });
  });
  // unfollow user
  it('Should return status of 404 unfollow', (done) => {
    chai.request(app)
      .delete('/api/users/unfollow/78348')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
  // unfollow user should return status code of 500
  it('Should return status of 500 unfollow', (done) => {
    chai.request(app)
      .delete('/api/users/unfollow/783487845685467458674586458654864586458')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(500);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
  // @get followers
  it('Should return status code of 200 / finding user followers', (done) => {
    chai.request(app)
      .get('/api/users/followers')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('followers');
        done();
      });
  });
  // @get following
  it('Should return status code of 200 / finding user followers', (done) => {
    chai.request(app)
      .get('/api/users/following')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) done(error);
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('following');
        done();
      });
  });
});
