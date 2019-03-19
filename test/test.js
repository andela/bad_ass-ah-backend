import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('GET INVALID_URL', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .get('/api/v1/INVALID_URL')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

