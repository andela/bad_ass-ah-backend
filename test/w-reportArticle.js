import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { testMailer, login6 } from '../testingdata/user.json';
import { reportArticleType } from '../testingdata/reportArticle.json';
import { article1 } from '../testingdata/article.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();

const {
  user, article, reportArticle, reportType
} = models;

describe('Report Article', () => {
  let userToken;
  let notAdminUserToken;
  let articleId;
  let reportTypeId;
  before(async () => {
    try {
      await user.update({ isAdmin: true }, { where: { email: testMailer.email } });
      const userLoggedIn = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: testMailer.email, password: testMailer.password });
      await user.update({ isAdmin: true }, { where: { email: login6.email } });
      userToken = `Bearer ${userLoggedIn.body.token}`;
      await reportArticle.destroy({ where: {}, truncate: true });
      await reportType.destroy({ where: reportArticleType });
      const oneArticle = await article.findOne({ where: { title: article1.title } });
      const notAdminLoggedIn = await chai.request(app).post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send(login6);
      notAdminUserToken = `Bearer ${notAdminLoggedIn.body.token}`;
      articleId = oneArticle.article_id;
    } catch (error) {
      throw new Error(error);
    }
  });
  describe('POST & GET/ report article', () => {
    it('Should return error report types are not found', (done) => {
      chai.request(app)
        .get('/api/report/types')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should create a report type', (done) => {
      chai.request(app)
        .post('/api/report/types')
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(reportArticleType)
        .end((err, res) => {
          reportTypeId = res.body.id;
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should return all report types', (done) => {
      chai.request(app)
        .get('/api/report/types')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].should.have.property('id');
          done();
        });
    });
    it('Should return error only admin user allowed to create a report type', (done) => {
      chai.request(app)
        .post('/api/report/types')
        .set('Authorization', notAdminUserToken)
        .set('Content-Type', 'application/json')
        .send(reportArticleType)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error a report type is required and should not be empty.', (done) => {
      chai.request(app)
        .post('/api/report/types')
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error a report type exists', (done) => {
      chai.request(app)
        .post('/api/report/types')
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send(reportArticleType)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error no reported articles found', (done) => {
      chai.request(app)
        .get('/api/report/articles')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          done();
        });
    });
    it('Should report article', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/report/type/${reportTypeId}`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send({ comment: '' })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.should.have.property('reportType');
          done();
        });
    });
    it('Should return reported articles', (done) => {
      chai.request(app)
        .get('/api/report/articles')
        .set('Authorization', userToken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body[0].should.have.property('comment');
          done();
        });
    });
    it('Should return error report type id should be an integer', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/report/type/1REPORT_TYPE_ID`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send({ comment: 'it is plagiarized' })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
    it('Should return error report type is not found', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/report/type/9878768767`)
        .set('Authorization', userToken)
        .set('Content-Type', 'application/json')
        .send({ comment: 'it is plagiarized' })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('body');
          done();
        });
    });
  });
});
