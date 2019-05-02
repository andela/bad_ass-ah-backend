import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer, login6 } from '../testingdata/user.json';
import { articleForHighlighting } from '../testingdata/article.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();

const { article, articleHighlights } = models;

describe('Highlight Text', () => {
  let userToken;
  let notCreatedHighlightUserToken;
  let articleId;
  let highlightId;
  const highlightedText = {
    indexStart: 100,
    indexEnd: 123,
    text: 'This is the highlighted',
    comment: 'Comment of highlighted text'
  };
  before(async () => {
    try {
      const userLoggedIn = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: testMailer.email, password: testMailer.password });
      userToken = `Bearer ${userLoggedIn.body.token}`;
      const anotherUserLoggedIn = await chai.request(app).post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send(login6);
      notCreatedHighlightUserToken = `Bearer ${anotherUserLoggedIn.body.token}`;
    } catch (error) {
      throw new Error(error);
    }
  });

  after(async () => {
    try {
      await articleHighlights.destroy({ where: {}, truncate: true });
      // await article.destroy({ where: { title: articleForHighlighting.title } });
    } catch (error) {
      throw new Error(error);
    }
  });
  describe('POST, GET & PUT/ highlight text', () => {
    it('Should create article ', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .field('title', articleForHighlighting.title)
        .field('body', articleForHighlighting.body)
        .field('tag', articleForHighlighting.tag)
        .attach('image', '')
        .end((err, res) => {
          if (err) done(err);
          articleId = res.body.article.article_id;
          res.should.have.status(201);
          done();
        });
    }).timeout(100000);
    it('Should return error no highlighted texts found for an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/highlights`)
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should create a highlighted text', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/highlights`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          highlightId = res.body.highlightedText.id;
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.should.have.property('highlightedText');
          done();
        });
    });
    it('Should return error conflict, user highlighted the same text of an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/highlights`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(409);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return all highlighted texts for user article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/highlights`)
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].should.be.an('object').have.property('indexStart');
          done();
        });
    });
    it('Should return error user not allowed to get all highlighted texts for an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/highlights`)
        .set('Authorization', notCreatedHighlightUserToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(403);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return all the user highlighted texts of an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/user-highlights`)
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].should.be.an('object').have.property('indexStart');
          done();
        });
    });
    it('Should return error not found the user highlighted texts of an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/user-highlights`)
        .set('Authorization', notCreatedHighlightUserToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return error user cannot update the highlighted text which he/she did not create', (done) => {
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', notCreatedHighlightUserToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(403);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should update a highlighted text', (done) => {
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.have.property('highlightedText');
          done();
        });
    });
    it('Should return error indexStart must be integer', (done) => {
      highlightedText.indexStart = '123notInteger';
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return error indexEnd must be integer', (done) => {
      highlightedText.indexStart = 0;
      highlightedText.indexEnd = '123notInteger';
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return error Text is empty', (done) => {
      highlightedText.indexEnd = 16;
      highlightedText.text = '    ';
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return error Comment is empty', (done) => {
      highlightedText.text = 'Text has updated';
      highlightedText.comment = '  ';
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should return error difference between index not match with text length', (done) => {
      highlightedText.text = 'Text';
      highlightedText.comment = 'This the comment field';
      chai.request(app)
        .put(`/api/articles/${articleId}/highlights/${highlightId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(highlightedText)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          done();
        });
    });
  });
});
