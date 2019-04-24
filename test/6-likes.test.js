import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  article1
} from '../testingdata/article.json';
import {
  login1
} from '../testingdata/user.json';

let APItoken;
let articleId;
chai.use(chaiHttp);
chai.should();

describe('votes', () => {
  before(async () => {
    try {
      const user = await chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send(login1);
      APItoken = `Bearer ${user.body.token}`;
      const article = await chai.request(app)
        .post('/api/articles')
        .set('Content-Type', 'application/json')
        .set('Authorization', APItoken)
        .send(article1);
      articleId = article.body.article.article_id;
    } catch (error) {
      console.log(error);
    }
  });
  it('should allow user to like', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleId}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        like: true,
        dislike: false
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
  });
  // should return status of code 404
  it('should retun status of 404 when user is going to like article', (done) => {
    chai.request(app)
      .post(`/api/articles/${10000}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        like: true,
        dislike: false
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });
  // should return 400 status
  it('should allow user to dislike', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleId}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        like: true,
        dislike: false
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
  it('should retun status of 500 when something goes wrong ', (done) => {
    chai.request(app)
      .post('/api/articles/:articleId/like')
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });
  // status code of 500
  it('should allow user to dislike', (done) => {
    chai.request(app)
      .post(`/api/articles/${null}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });
  it('should allow user to dislike', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleId}/dislike`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
  });
  // shoull return status code of 400
  it('should allow user to dislike', (done) => {
    chai.request(app)
      .post(`/api/articles/${articleId}/dislike`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        like: false,
        dislike: true
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
  // shoull return status code of 500
  it('should allow user to dislike', (done) => {
    chai.request(app)
      .post(`/api/articles/${null}/dislike`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });
});
