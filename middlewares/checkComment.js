import models from '../models/index';


const Comment = models.comments;

const check = async (req, res, next) => {
  try {
    const findComment = await Comment.findOne({ where: { id: req.params.commentId } });
    if (!findComment) {
      return res.status(404).json({ status: 404, error: 'Unfound Comment Id' });
    }
    // @check if authors are the same
    if (findComment.author !== req.user.id) {
      return res.status(403).json({ status: 403, error: 'permission denied, you are not allowed to perform this action.' });
    }
    req.findComment = findComment;
    next();
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

export default check;
