import Validator from './validateUser';

const search = (req, res, next) => {
  if (Validator.isEmpty(req.query.search)) {
    return res.status(400).json({ error: ' no result found.'});
  }
  next();
};
export default search;
