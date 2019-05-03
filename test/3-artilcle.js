import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { article1 } from '../testingdata/article.json';
import shareArticle from '../helpers/shareArticles';
import { login4, testMailer } from '../testingdata/user.json';
import models from '../models/index';
import tag from '../helpers/tags';
import generateToken from '../helpers/token';

chai.use(chaiHttp);
chai.should();
const { article: Article, user } = models;
let APItoken;
let APItoken2;
let articleId;
const req = {
  query: {
    search: 'a'
  }
};
const facebookUrl = {
  req: {
    params: {
      url: 'facebook',
      articleId: 1
    }
  }
};
const twitterUrl = {
  req: {
    params: {
      url: 'twitter',
      articleId: 1
    }
  }
};
const linkedUrl = {
  req: {
    params: {
      url: 'linkedin',
      articleId: 1
    }
  }
};
const gmailUrl = {
  req: {
    params: {
      url: 'gmail',
      articleId: 1
    }
  }
};

// const url = 'https://twitter.com/intent/tweet?text=https://badass-ah-backend-staging.herokuapp.com/api/articles';
describe('Article', () => {
  before(async () => {
    try {
      await Article.destroy({ where: { title: article1.title } });
      const tokens = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send({
        email: testMailer.email, password: testMailer.password
      });
      APItoken = `Bearer ${tokens.body.token}`;
      // const login2 = await chai.request(app).
      // .post('/api/users/login').set('Content-Type', 'application/json').send(login4);
      const findLogin2 = await user.findOne({ where: { email: login4.email } });
      const { generate } = generateToken({
        id: findLogin2.id,
        email: findLogin2.email
      });
      APItoken2 = `Bearer ${generate}`;
      // APItoken2 = `Bearer ${login2.body.token}`;
    } catch (error) {
      console.log(error);
    }
  });
  // @create article
  it('Should create article ', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('Authorization', APItoken)
      .set('Content-Type', 'multipart/form-data')
      .field('title', article1.title)
      .field('body', article1.body)
      .field('tag', article1.tag)
      .attach('image', '')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        articleId = res.body.article.article_id;
        res.should.have.status(201);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        res.body.should.have.property('article');
        done();
      });
  }).timeout(100000);
  it('Should  have server errors ', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('Authorization', APItoken)
      .set('Content-Type', 'multipart/form-data')
      .field('tag', article1.tag)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(500);
        done();
      });
  });
  // @get all created article
  it('Should get all article ', (done) => {
    chai.request(app)
      .get('/api/articles')
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('articles');
        done();
      });
  });
  // @get single articles
  it('Should get single article ', (done) => {
    chai.request(app)
      .get(`/api/articles/${articleId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
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
  // @when single article is not available
  it('Should get single article ', (done) => {
    chai.request(app)
      .get('/api/articles/5000')
      .set('Content-Type', 'application/json')
      .set('Authorization', APItoken)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        res.body.should.have.property('errors');
        done();
      });
  });
  // @should return status of 200
  it('Should return status code of 200 when updating article', (done) => {
    chai.request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', APItoken)
      .set('Content-Type', 'multipart/form-data')
      .field('title', article1.title)
      .field('body', article1.body)
      .field('tag', article1.tag)
      .attach('image', '')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        done();
      });
  });
  // should return status code of 403
  it('Should return status  code of 403', (done) => {
    chai.request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', APItoken2)
      .set('Content-Type', 'multipart/form-data')
      .field('title', article1.title)
      .field('body', article1.body)
      .field('tag', article1.tag)
      .attach('image', '')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(403);
        res.body.should.have.property('error');
        done();
      });
  });
  // @should return 404
  // @article not found
  it('Should return status  code of 404', (done) => {
    chai.request(app)
      .put('/api/articles/5007')
      .set('Authorization', APItoken)
      .set('Content-Type', 'multipart/form-data')
      .field('title', article1.title)
      .field('body', article1.body)
      .field('tag', article1.tag)
      .attach('image', '')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        done();
      });
  });
  it('Should return status  code of 500', (done) => {
    chai.request(app)
      .put('/api/articles/5007458674867495769456745')
      .set('Authorization', APItoken)
      .set('Content-Type', 'multipart/form-data')
      .field('title', article1.title)
      .field('body', article1.body)
      .field('tag', article1.tag)
      .attach('image', '')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(500);
        done();
      });
  });
  // @delete article
  // @ return status code of 200
  it('should return status code of 200 on deleting article', (done) => {
    chai.request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', APItoken)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        done();
      });
  });
  // @delete article
  it('should return status code of 404 on deleting article', (done) => {
    chai.request(app)
      .delete('/api/articles/5000')
      .set('Authorization', APItoken)
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        done();
      });
  });
  it('Should allow the user to share an articles across facebook channel', async () => {
    const result = await shareArticle.openChannelUrl(facebookUrl.req);
    result.should.be.a('object');
  });
  it('Should allow the user to share an articles across twitter channel', async () => {
    const result = await shareArticle.openChannelUrl(twitterUrl.req);
    result.should.be.a('object');
  });
  it('Should allow the user to share an articles across linkedin channel', async () => {
    const result = await shareArticle.openChannelUrl(linkedUrl.req);
    result.should.be.a('object');
  });
  it('Should allow the user to share an articles across gmail channel', async () => {
    const result = await shareArticle.openChannelUrl(gmailUrl.req);
    result.should.be.a('object');
  });
  // @search
  // should return status of 400
  it('Should return status code of 400', (done) => {
    chai.request(app)
      .post('/api/search/?search=')
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
  it('Should return status code of 200', (done) => {
    chai.request(app)
      .post('/api/search/?search=a')
      .set('Content-Type', 'application/json')
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('article');
        res.body.should.have.property('user');
        res.body.should.have.property('tags');
        done();
      });
  });
  it('Should test tags helpers', async () => {
    const tagList = await tag(req);
    tagList.should.be.a('array');
  });
  it('Should allow a given user to share an article via email', (done) => {
    chai.request(app)
      .get(`/api/articles/${articleId}/share/email`)
      .set('Authorization', APItoken)
      .end((error, res) => {
        if (error) {
          done();
        }
        res.should.have.status(200);
        done();
      });
  });
});
