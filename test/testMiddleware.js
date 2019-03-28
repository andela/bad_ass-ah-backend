import chai from 'chai';
import chaiHttp from 'chai-http';
import userValidate from '../helpers/validate';
import app from '.././index';

chai.use(chaiHttp);
chai.should();

describe('validate',() => {
    it('should return 400 status code when inputs are not valid', (done) =>{
        chai.request(app)
        .post('/api/users')
        .end((err, res) =>{
            res.should.have.status(400);
            done();
        });
    })
})