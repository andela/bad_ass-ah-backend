import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../models/index';
import app from '../index';

chai.use(chaiHttp);
chai.should();
const User = models.user;


describe('/api/users/password', () => {
  describe('POST reset password', () => {
    const newUser = {
      email: 'bienaime.fabrice@andela.com',
      username: 'copain2',
      password: '1Kig1L@20',
    };
    const wrongEmail = 'bienaimefabrice@andela.com';
    before(async () => {
      try {
        await User.destroy({
          where: {
            email: newUser.email
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    });
    before((async () => {
      try {
        return User.create(newUser);
      } catch (error) {
        throw error;
      }
    }));
    describe('sent an incorrect email', () => {
      const status = 404;
      it(`return status ${status}`, (done) => {
        chai.request(app)
          .post('/api/users/password')
          .send({
            email: wrongEmail
          })
          .end((err, res) => {
            res.should.have.status(status);
            done();
          });
      });
    });
    describe('POST/ send reset password', () => {
      it('should return an error if the token is invalid', (done) => {
        chai.request(app)
          .post('/api/users/password')
          .send({ email: 'bienaime.fabrice@andela.com' })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(200);
            res.should.be.an('object');
            done();
          });
      }).timeout(20000);
    });
  });
});
