import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { article1 } from '../testingdata/article.json';
import { login1 } from '../testingdata/user.json';
import shareArticle from '../helpers/shareArticles';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();
const Article = models.article;
let APItoken;
let articleId;
const facebookUrl = {
  req: {
    params: {
      url: 'facebook'
    }
  }
};
const twitterUrl = {
  req: {
    params: {
      url: 'twitter'
    }
  }
};
const linkedUrl = {
  req: {
    params: {
      url: 'linkedin'
    }
  }
};

// const url = 'https://twitter.com/intent/tweet?text=https://badass-ah-backend-staging.herokuapp.com/api/articles';
describe('Article', () => {
  before(async () => {
    try {
      await Article.destroy({ where: { title: article1.title } });
      const tokens = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login1);
      APItoken = `Bearer ${tokens.body.token}`;
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
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        res.body.should.have.property('error');
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
  // @should return 404
  // @article not found
  it('Should return status  code of 404', (done) => {
    chai.request(app)
      .put('/api/articles/500')
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
});
