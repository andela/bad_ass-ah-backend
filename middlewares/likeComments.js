import models from '../models/index';

const VoteComment = models.votecomment;

// eslint-disable-next-line import/prefer-default-export
const checkVote = async (req, res) => {
  try {
    const search = await VoteComment.findOne({
      where: {
        userId: req.user.id,
        commentId: req.params.commentId
      }
    });
    return search;
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `something wrong please try again.${error}`
    });
  }
};
const checkLikes = async (req, res, next) => {
  const vote = await checkVote(req, res);
  if (!vote) {
    req.likeComment = null;
    next();
  } else {
    req.likeComment = vote;
    next();
  }
};
export default checkLikes;
