import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { article1 } from '../testingdata/article.json';
import { testMailer } from '../testingdata/user.json';
import { comment1 } from '../testingdata/comment.json';
import models from '../models/index';

const { votecomment: VoteComment } = models;

let APItoken;
let userId;
let articleId;
let commentId;
chai.use(chaiHttp);
chai.should();

describe('votes', () => {
  before(async () => {
    try {
      await VoteComment.destroy({
        where: {}
      });
      const user = await chai
        .request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({
          email: testMailer.email,
          password: testMailer.password
        });
      APItoken = `Bearer ${user.body.token}`;
      userId = user.body.user.id;
      const article = await chai
        .request(app)
        .post('/api/articles')
        .set('Content-Type', 'application/json')
        .set('Authorization', APItoken)
        .send(article1);
      articleId = article.body.article.article_id;
      const comment = await chai
        .request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set('Content-Type', 'application/json')
        .set('Authorization', APItoken)
        .send(comment1);
      commentId = comment.body.createdComment.id;
    } catch (error) {
      throw error;
    }
  });
  it('should allow user to like a comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/comments/${commentId}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        userId,
        commentId,
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
  // user has already liked the comment.
  it('shoudl return 400 to a user who has already liked a comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/comments/${commentId}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        userId,
        commentId,
        like: true,
        dislike: false
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        res.should.have.property('error');
        done();
      });
  });
  // should allow a user to dislike a comment
  it('should allow user to dislike a comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/comments/${commentId}/dislike`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        userId,
        commentId,
        like: false,
        dislike: true
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
  it('should allow user to like a comment', (done) => {
    chai
      .request(app)
      .post(`/api/articles/comments/${commentId}/like`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .send({
        userId,
        commentId,
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
  it('should retun status of 500 when something goes wrong ', (done) => {
    chai
      .request(app)
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
});
