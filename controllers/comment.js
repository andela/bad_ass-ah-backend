import models from '../models/index';

const Comment = models.comments;
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
    // @save comments
    Comment.create(newComment)
      .then((comment) => {
        res.status(201).json({ status: 201, comment });
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
      .then((allComment) => {
        res.status(200).json({ status: 200, allComment });
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
        // @ send to the user the edited comment
        res.status(200).json({ status: 200, comment: comment[1] });
      });
  }

  /**
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} -will delte a given comment
 */
  static deleteComment(req, res) {
    Comment.destroy({ where: { id: req.params.commentId }, returning: true })
      .then(() => {
        res.status(200).json({ status: 200, message: 'Comment deleted successfully' });
      });
  }
}

export default CommentController;
