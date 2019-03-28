import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { article1 } from '../testingdata/article.json';
import { login1 } from '../testingdata/user.json';
import models from '../models/index';

chai.use(chaiHttp);
chai.should();
const Article = models.article;
let APItoken;
describe('Article', () => {
  before(async () => {
    try {
      // await Article.destroy({ where: { title: article1.title } });
      const tokens = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login1);
      APItoken = `Bearer ${tokens.body.token}`;
    } catch (error) {
      console.log(error);
    }
  });
  // // @create article
  // it('Should create article ', (done) => {
  //   chai.request(app)
  //     .post('/api/articles')
  //     .set('Authorization', APItoken)
  //     .set('Content-Type', 'multipart/form-data')
  //     .field('title', article1.title)
  //     .field('body', article1.body)
  //     .field('tag', article1.tag)
  //     .attach('image', '')
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       console.log(APItoken);
  //       res.should.have.status(201);
  //       res.body.should.have.property('status');
  //       res.body.should.have.property('message');
  //       res.body.should.have.property('article');
  //       done();
  //     });
  // }).timeout(100000);
  // it('Should  have server errors ', (done) => {
  //   chai.request(app)
  //     .post('/api/articles')
  //     .set('Authorization', APItoken)
  //     .set('Content-Type', 'multipart/form-data')
  //     .field('tag', article1.tag)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       res.should.have.status(500);
  //       done();
  //     });
  // });
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
});
