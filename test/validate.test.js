import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('validate', () => {
  const user = {
    username: 'copain',
    email: 'copain@',
    password: 'copain'
  };
  it('should return 400 status code when inputs are not valid', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('should return 400 status code when input fields are empty', (done) => {
    user.email = '';
    chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
