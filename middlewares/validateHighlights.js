import validator from '../helpers/validateUser';
import httpError from '../helpers/errors/httpError';


const isTextLengthMatchIndexes = (text, indexStart, indexEnd) => {
  const index1 = parseInt(indexStart, 10);
  let index2 = parseInt(indexEnd, 10);
  if (index1 === 0) index2 += 1;
  return text.length === (index2 - index1);
};

const validateHighlights = async (req, res, next) => {
  const {
    indexStart, indexEnd, text, comment
  } = req.body;
  await validator.isInteger(indexStart, 'IndexStart');
  await validator.isInteger(indexEnd, 'IndexEnd');
  if (validator.isEmpty(text) || validator.isEmpty(comment)) throw new httpError(400, 'Both Text & Comment should not contain empty characters');
  if (!isTextLengthMatchIndexes(text, indexStart, indexEnd)) throw new httpError(400, 'Text length & difference between Indexes not match');
  next();
};

export default validateHighlights;
