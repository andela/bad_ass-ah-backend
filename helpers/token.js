import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = (payload) => {
  const generate = jwt.sign(payload, process.env.secretOrKey, {
    expiresIn: '1day'
  });
  return {
    generate
  };
};

export default token;
