import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { validateComment } from '../testingdata/comment.json';
import { testMailer } from '../testingdata/user.json';

chai.use(chaiHttp);
chai.should();

let validComment;
let userId;
let idArticle;
let idComment;

const invalidToken = 'EAAgbksnPT5IBAI2f478gPi5HZC9iAvldAtZCKhDPXaZCt0cTEr9kuDbETW1wZCDF17alOnG7qdKZB14O4rr2zg6gtkuU6Q14G9idx1JOZAHcFgtQam72PoBzvjgyyl1BxgiFGMHOwVGVPi23QilFQ1z2hUJCYCHyBYT6qfsfCmFwZDZD';
let token;

describe('Comment', () => {
  before(async () => {
    try {
      const loginUser = await chai
        .request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: testMailer.email, password: testMailer.password });
      token = `Bearer ${loginUser.body.token}`;

      userId = loginUser.body.user.id;

      const givenArticle = {
        title: 'new article',
        body: 'article body body',
        author: userId
      };

      const givenComment = {
        text: 'Good article'
      };

      const postArticle = await chai
        .request(app)
        .post('/api/articles')
        .set('Authorization', token)
        .send(givenArticle);
      idArticle = postArticle.body.article.article_id;
      await chai
        .request(app)
        .post(`/api/articles/${idArticle}/comments`)
        .set('Authorization', token)
        .send(givenComment);
    } catch (error) {
      throw error;
    }
  });

  it('Should not let the user comment an article without a token', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${idArticle}/comments`)
      .set('Content-Type', 'application/json')
      .send(validComment)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('Should not let the user comment an article without an invalid token', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${idArticle}/comments`)
      .set('Authorization', invalidToken)
      .send(validComment)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it('Should not let the user comment with an empty body', (done) => {
    validComment = {
      body: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    chai
      .request(app)
      .post(`/api/articles/${idArticle}/comments`)
      .set('Authorization', token)
      .send(validateComment)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('Should not let the user comment an article with a wrong Id', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    const id = 187698;
    chai
      .request(app)
      .post(`/api/articles/${id}/comments`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        done();
      });
  });
  it('Should let the user comment an article', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    chai
      .request(app)
      .post(`/api/articles/${idArticle}/comments`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
          throw err;
        }
        idComment = res.body.createdComment.id;
        res.should.have.status(201);
        done();
      });
  }).timeout(100000);
  it('Should throw 500', (done) => {
    validComment = {
      text: ' sdfsdfsdf'
    };
    chai
      .request(app)
      .post(`/api/articles/${null}/comments`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        done();
      });
  });
  it('Should not let the user Update a comment with a wrong Id', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    const wrongId = 187698;
    chai
      .request(app)
      .put(`/api/articles/${idArticle}/comments/${wrongId}`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        done();
      });
  });
  it('Should not let the user Delete a comment with a wrong Id', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    const wrongId = 187698;
    chai
      .request(app)
      .delete(`/api/articles/${idArticle}/comments/${wrongId}`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        done();
      });
  });
  it('Should let the user Update comment', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    chai
      .request(app)
      .put(`/api/articles/${idArticle}/comments/${idComment}`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        done();
      });
  }).timeout(100000);
  it('Should  return a status of 404 when there is not comment posted to the provided articleId', (done) => {
    const wrongArticleId = 99999;
    chai
      .request(app)
      .get(`/api/articles/${wrongArticleId}/comments`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('Should  let the user get all comments', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${idArticle}/comments`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should  let the user get a single comment', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${idArticle}/comments/${idComment}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should  let the user get edited comments', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${idArticle}/comments/${idComment}/edited`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should  let the user delete a comment', (done) => {
    validComment = {
      text: 'What makes you special',
      articleId: idArticle,
      author: userId
    };
    chai
      .request(app)
      .delete(`/api/articles/${idArticle}/comments/${idComment}`)
      .set('Authorization', token)
      .send(validComment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        done();
      });
  });
});
