import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer, signup5 } from '../testingdata/user.json';
import { article1 } from '../testingdata/article.json';
import models from '../models/index';
import generateToken from '../helpers/token';

chai.use(chaiHttp);
chai.should();

const { rate, article, user } = models;

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

      const unverifiedUserLoggedIn = await user.findOne({ where: { email: signup5.email } });
      const { generate } = generateToken({
        id: unverifiedUserLoggedIn.id,
        email: unverifiedUserLoggedIn.email
      });
      unverifiedUserToken = `Bearer ${generate}`;
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
    it('Should return error article has not rated', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/average-rating`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error user have not rated this article rating', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/user-article-rating`)
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
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
    it('Should return user article rating', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/user-article-rating`)
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('rating');
          res.body.rating.should.have.property('rating');
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
    it('Should return average rating of an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/average-rating`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('rating');
          res.body.rating.should.have.property('average');
          done();
        });
    });
    it('Should return all article ratings on a single page', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/rate?page=1`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('ratings');
          res.body.ratings.should.be.an('array');
          done();
        });
    });

    it('Should return all article ratings on a single page with specified limit', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/rate?page=1&limit=1`)
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
