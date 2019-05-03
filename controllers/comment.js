import models from '../models/index';
import Notification from './notification';


const Comment = models.comments;
const User = models.user;
const Votes = models.votecomment;
const EditedCommentHistory = models.editedcommentshistory;
/**
 * @param {class} --Comment controller
 */
class CommentController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} will create a comment
   */
  static create(req, res) {
    // @comment
    const newComment = {
      body: req.body.content,
      articleId: req.params.articleId,
      author: req.user.id
    };
    // @save comments and history
    Comment.create(newComment)
      .then((comment) => {
        const newCommentHistory = {
          commentId: comment.id,
          userId: req.user.id,
          body: req.body.content
        };
        EditedCommentHistory.create(newCommentHistory);
        User.findOne({ where: { id: comment.author } })
          .then(async (user) => {
            const message = `${user.username} commented on an article you favorite`;
            await Notification.createFavorite(comment.articleId, message, comment.author);
            await Notification.sendFavorite(comment.articleId, message, comment.author);
            res.status(201).json({ status: 201, comment });
          });
      });
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} - will return all comment related to an article
   */
  static getAllComment(req, res) {
    Comment.findAll({ where: { articleId: req.params.articleId } })
      .then((comment) => {
        if (comment.length === 0) {
          return res.status(404).json({ status: 404, error: 'No comment has been posted to that article' });
        }
        return res.status(200).json({ status: 200, comment });
      });
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} return a json object
   */
  static getEditedComment(req, res) {
    EditedCommentHistory.findAll({
      where: { commentId: req.params.commentId }
    })
      .then((editedComment) => {
        res.status(200).json({
          status: 200,
          editedComment
        });
      });
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} -will return an updated Comment
   */
  static updateComment(req, res) {
    Comment.update({ body: req.body.content },
      { where: { id: req.params.commentId }, returning: true })
      .then((comment) => {
        User.findOne({ where: { id: comment[1][0].author } })
          .then(async (user) => {
            const message = `${user.username} updated his comment on an article you favorite`;
            await Notification.createFavorite(comment[1][0].articleId,
              message, comment[1][0].author);
            await Notification.sendFavorite(comment[1][0].articleId, message, comment[1][0].author);
            const edited = {
              commentId: req.params.commentId,
              userId: req.user.id,
              body: req.body.content
            };
            // @save the comment history
            EditedCommentHistory.create(edited);
            res.status(200).json({ status: 200, comment: comment[1] });
          });
      })
      .catch((error) => {
        res.status(500).json({ status: 500, message: error.message });
      });
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} -will delte a given comment
   */
  static deleteComment(req, res) {
    Comment.destroy({
      where: { id: req.params.commentId },
      returning: true
    })
      .then(() => {
        res.status(200).json({ status: 200, message: 'Comment deleted successfully' });
      });
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  view single comment
   * @returns {Object} return a comment
   */
  static async singleComment(req, res) {
    const { user } = req;
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);
    const likes = await Votes.count({ where: { commentId, like: true } });
    const dislikes = await Votes.count({ where: { commentId, dislike: true } });
    const votes = {
      likes,
      dislikes,
      hasLiked: false,
      hasDisliked: false
    };
    if (user !== undefined) {
      const userVotes = await Votes.findOne({
        where: { commentId, userId: user.id },
        attributes: ['like', 'dislike']
      });
      if (userVotes) {
        votes.hasLiked = userVotes.like || false;
        votes.hasDisliked = userVotes.dislike || false;
      }
    }
    res.status(200).json({ status: 200, comment: comment.get(), votes });
  }
}

export default CommentController;
