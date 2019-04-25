import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer, signup1 } from '../testingdata/user.json';
import { article1 } from '../testingdata/article.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();

const { rate, article } = models;

describe('Article ratings and reading stats', () => {
  let userToken;
  let unverifiedUserToken;
  let articleId;
  before(async () => {
    try {
      const userLoggedIn = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: testMailer.email, password: testMailer.password });
      userToken = `Bearer ${userLoggedIn.body.token}`;
      await rate.destroy({ where: {}, truncate: true });
      await article.destroy({ where: { title: article1.title } });
      const unverifiedUserLoggedIn = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: signup1.email, password: signup1.password });
      unverifiedUserToken = `Bearer ${unverifiedUserLoggedIn.body.token}`;

      await rate.destroy({ where: {}, truncate: true });
    } catch (error) {
      throw new Error(error);
    }
  });
  describe('POST and Get/ Send or get ratings to a particular article ', () => {
    const rates = { rating: 5 };
    it('Should create article ', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .field('title', article1.title)
        .field('body', article1.body)
        .field('tag', article1.tag)
        .attach('image', '')
        .end((err, res) => {
          if (err) done(err);
          articleId = res.body.article.article_id;
          res.should.have.status(201);
          done();
        });
    }).timeout(100000);
    it('Should return error article ratings not found', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/rate`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should send article rating', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/rate`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('ratings');
          res.body.ratings.should.have.property('rating');
          done();
        });
    });
    it('Should return all article ratings', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/rate`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('ratings');
          res.body.ratings.should.be.an('array');
          done();
        });
    });
    it('Should send article rating for update user rating to an article', (done) => {
      rates.rating = 2;
      chai.request(app)
        .post(`/api/articles/${articleId}/rate`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('ratings');
          res.body.ratings.should.have.property('rating');
          done();
        });
    });
    it('Should return error ratings must be integer btw 1 and 5', (done) => {
      rates.rating = 9;
      chai.request(app)
        .post(`/api/articles/${articleId}/rate`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error article not found', (done) => {
      rates.rating = 4;
      chai.request(app)
        .post('/api/articles/99999989839989989/rate')
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error article id should be integer', (done) => {
      rates.rating = 4;
      chai.request(app)
        .post('/api/articles/3ArticleIDString/rate')
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error if user account not activated', (done) => {
      rates.rating = 4;
      chai.request(app)
        .post(`/api/articles/${articleId}/rate`)
        .set('Authorization', unverifiedUserToken)
        .set('Content-Type', 'application/json')
        .send(rates)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(403);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
  });
  describe('GET/ reading stats', () => {
    it('Should record user reading', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/record-reading`)
        .set('Authorization', userToken)
        .send()
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should update the date a user read an article ', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/record-reading`)
        .set('Authorization', userToken)
        .send()
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should return user reading stats', (done) => {
      chai.request(app)
        .get('/api/users/reading-stats')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('totalReading');
          done();
        });
    });
  });
});
