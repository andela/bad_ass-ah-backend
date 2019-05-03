import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer } from '../testingdata/user.json';
import { articleForHighlighting } from '../testingdata/article.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();

const { article } = models;

describe('Bookmark article', () => {
  let userToken;
  let articleId;

  before(async () => {
    try {
      const userLoggedIn = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: testMailer.email, password: testMailer.password });
      userToken = `Bearer ${userLoggedIn.body.token}`;
      const getArticle = await article.findOne({ where: { title: articleForHighlighting.title } });
      articleId = getArticle.article_id;
    } catch (error) {
      throw new Error(error);
    }
  });

  after(async () => {
    try {
      await article.destroy({ where: { title: articleForHighlighting.title } });
    } catch (error) {
      throw new Error(error);
    }
  });
  describe('POST & GET/ Bookmark article ', () => {
    it('Should return error when no bookmarks are found', (done) => {
      chai.request(app)
        .get('/api/articles/bookmark')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should bookmark an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/bookmark`)
        .set('Authorization', userToken)
        .send()
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.be.an('object');
          done();
        });
    });
    it('Should get single article ', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((error, res) => {
          if (error) {
            done(error);
          }
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.should.have.property('article');
          done();
        });
    });
    it('Should return all found bookmarks', (done) => {
      chai.request(app)
        .get('/api/articles/bookmark')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
    it('Should unbookmark an article ', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/bookmark`)
        .set('Authorization', userToken)
        .send()
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('message');
          done();
        });
    });
  });
});
