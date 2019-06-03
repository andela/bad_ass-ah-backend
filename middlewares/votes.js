import models from '../models/index';

const Vote = models.vote;

// eslint-disable-next-line import/prefer-default-export
const checkVote = async (req, res) => {
  try {
    // eslint-disable-next-line max-len
    const search = await Vote.findOne({ where: { user: req.user.id, article: req.params.articleId } });
    return search;
  } catch (error) {
    return res.status(500).json({ status: 500, message: `something wrong please try again.${error}` });
  }
};
const checkLikes = async (req, res, next) => {
  const vote = await checkVote(req, res);
  if (!vote) {
    req.vote = null;
    next();
  } else {
    req.vote = vote;
    next();
  }
};
export default checkLikes;
