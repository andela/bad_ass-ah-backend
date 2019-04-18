import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import models from '../models/index';
import NotificationController from '../controllers/notification';
import { login1, testMailer } from '../testingdata/user.json';

chai.use(chaiHttp);
chai.should();
const Comment = models.comments;
const User = models.user;
const Notification = models.notification;

let userId;
let idArticle;
let token;
let token2;
let notifier;

describe('Notification', () => {
  before(async () => {
    try {
      const loginUser = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(login1);
      const loginUser2 = await chai.request(app).post('/api/users/login').set('Content-Type', 'application/json').send(testMailer);
      token = `Bearer ${loginUser.body.token}`;
      token2 = `Bearer ${loginUser2.body.token}`;
      userId = loginUser.body.user.id;

      const givenArticle = {
        title: 'new article',
        body: 'article body body',
        author: userId
      };

      const givenComment1 = {
        content: 'Woowww! Nice article bro:)'
      };

      const givenComment2 = {
        content: 'What?????? You must be joking:)'
      };

      const postArticle = await chai.request(app).post('/api/articles').set('Authorization', token).send(givenArticle);
      idArticle = postArticle.body.article.article_id;
      await chai.request(app).post(`/api/articles/${idArticle}/comments`).set('Authorization', token2).send(givenComment1);
      const postComment = await chai.request(app).post(`/api/articles/${idArticle}/comments`).set('Authorization', token).send(givenComment2);
      notifier = postComment.body.comment.author;
      await chai.request(app).post(`/api/users/follow/${userId}`).set('Authorization', token2);

      await User.update(
        { allowNotifications: false },
        { where: { email: 'pacifiqueclement@gmail.com' } }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  after((done) => {
    Comment.destroy({
      where: {},
      truncate: true,
    }).then(() => {

    }).catch((error) => {
      throw error;
    });

    Notification.destroy({
      where: {},
      truncate: true,
    }).then(() => {

    }).catch((error) => {
      throw error;
    });
    done();
  });

  it('should create favorites notifications', (done) => {
    NotificationController.createFavorite(idArticle, 'Article updated', notifier)
      .then((data) => {
        data.should.be.a('array');
        done();
      }).catch((error) => {
        console.log(error);
        done();
      });
  });

  it('should create followers notifications', (done) => {
    NotificationController.createFollower(userId, 'New Article created')
      .then((data) => {
        data.should.be.a('array');
        done();
      }).catch((error) => {
        console.log(error);
        done();
      });
  });

  it('should send followers notifications', (done) => {
    NotificationController.sendFollower(userId, 'New Article created')
      .then((data) => {
        data.should.be.a('string');
        done();
      }).catch((error) => {
        console.log(error);
        done();
      });
  });

  it('should get all notifications', (done) => {
    chai.request(app)
      .get('/api/users/notifications')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('notifications');
        done();
      });
  });

  it('should get one notification', (done) => {
    const base64Url = token2.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
    Notification.findOne({ where: { userId: decodedData.id } })
      .then((notification) => {
        chai.request(app)
          .get(`/api/users/notifications/${notification.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token2)
          .end((error, res) => {
            if (error) {
              done(error);
            }
            res.should.have.status(200);
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('notification');
            done();
          });
      });
  });

  it('should not get one notification if the id does not exist', (done) => {
    chai.request(app)
      .get('/api/users/notifications/10000000')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Notification not found');
        done();
      });
  });

  it('should 500 if the notification is not an integer', (done) => {
    chai.request(app)
      .get('/api/users/notifications/good')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not get one notification if the id does not exist', (done) => {
    chai.request(app)
      .delete('/api/users/notifications/10000000')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Notification not found');
        done();
      });
  });

  it('should 500 if the notification is not an integer', (done) => {
    chai.request(app)
      .delete('/api/users/notifications/good')
      .set('Content-Type', 'application/json')
      .set('Authorization', token2)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(500);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should delete one notification', (done) => {
    const base64Url = token2.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
    Notification.findOne({ where: { userId: decodedData.id } })
      .then((notification) => {
        chai.request(app)
          .delete(`/api/users/notifications/${notification.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .end((error, res) => {
            if (error) {
              done(error);
            }
            res.should.have.status(200);
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('message').eql('Notification successfully deleted.');
            done();
          });
      });
  });

  // subscription
  it('should unsubscribe user', (done) => {
    chai.request(app)
      .get('/api/users/notifications/subscribe')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('user');
        done();
      });
  });

  it('should subscribe user', (done) => {
    chai.request(app)
      .get('/api/users/notifications/subscribe')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('user');
        done();
      });
  });
});
