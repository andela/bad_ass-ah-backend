import Validate from './validateUser';

const userValidate = (req, res, next) => {
  if (Validate.isEmpty(req.body.email)) {
    return res.status(400).json({ error: 'Please provide email' });
  }
  if (!Validate.email(req.body.email)) {
    return res.status(400).json({ error: 'Please provide a valid email' });
  }
  if (!Validate.password(req.body.password)) {
    return res.status(400).json({ error: 'Your password should be alphanumeric and have at least 8 character long' });
  }
  next();
};
export default userValidate;
