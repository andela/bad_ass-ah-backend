/* eslint-disable object-curly-newline */
import models from '../models/index';

const VoteComment = models.votecomment;

/** *
 * @param {request } req request
 * @param {response} res response
 */

// eslint-disable-next-line require-jsdoc
class CommentVotesController {
  /** *
   * @param {request } req request
   * @param {response} res response
   * @returns {message} message
   */
  async likeComment(req, res) {
    try {
      // eslint-disable-next-line max-len
      const likeData = { userId: req.user.id, commentId: req.params.commentId, like: true, dislike: false };
      if (req.likeComment === null) {
        await VoteComment.create(likeData);
        return res.status(200).json({ message: 'thanks for the support.', userId: req.user.id, comment: req.params.commentId, hasLiked: true });
      }
      if (req.likeComment.like === true) {
        return res.status(400).json({ error: 'sorry you have already liked this comment.', hasLiked: false });
      }
      await VoteComment.update(likeData, { where: { id: req.likeComment.id } });
      return res.status(200).json({ message: 'thanks for the support.', userId: req.user.id, comment: req.likeComment, hasLiked: true
      });
    } catch (error) {
      return res.status(500).json({ error: 'something wrong try again later.' });
    }
  }

  /** *
   * @param {request } req request
   * @param {response} res response
   * @returns {message} message
   */

  // eslint-disable-next-line require-jsdoc
  async dislikeComment(req, res) {
    try {
    // eslint-disable-next-line max-len
      const dislikeData = { userId: req.user.id, commentId: req.params.commentId, like: false, dislike: true };
      if (req.likeComment === null) {
        await VoteComment.create(dislikeData);
        return res.status(200).json({ message: 'thanks.', hasDisLiked: true });
      }
      if (req.likeComment.dislike === true) {
        return res.status(400).json({
          error: 'sorry you have already disliked this comment.',
          hasDisLiked: false
        });
      }
      await VoteComment.update(dislikeData, {
        where: { id: req.likeComment.id }
      });
      return res.status(200).json({ message: 'thanks.', userId: req.user.id, commentId: req.params.commentId, hasDisLiked: true
      });
    } catch (error) {
      return res.status(500).json({ error: 'something wrong try again later.' });
    }
  }
}

export default CommentVotesController;
