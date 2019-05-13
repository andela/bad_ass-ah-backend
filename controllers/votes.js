import models from '../models/index';

const Vote = models.vote;

/** *
 * @param {request } req request
 * @param {response} res response
 */

// eslint-disable-next-line require-jsdoc
class VotesController {
  /** *
 * @param {request } req request
 * @param {response} res response
 * @returns {message} message
 */
  async likeArticle(req, res) {
    try {
      const likeData = {
        user: req.user.id,
        article: req.params.articleId,
        like: true,
        dislike: false
      };
      if (req.vote === null) {
        await Vote.create(likeData);
        return res.status(200).json({ message: 'thanks for the support.' });
      } if (req.vote.like === true) {
        return res.status(400).json({ error: 'sorry you have already liked this article.' });
      }
      await Vote.update(likeData, { where: { vote_id: req.vote.vote_id } });
      return res.status(200).json({
        message: 'thanks for the support.',
        userId: req.user.id,
        article: req.params.articleId,
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
  async dislikeArticle(req, res) {
    try {
      const dislikeData = {
        user: req.user.id,
        article: req.params.articleId,
        like: false,
        dislike: true
      };
      if (req.vote === null) {
        await Vote.create(dislikeData);
        return res.status(200).json({ message: 'thank for support.' });
      } if (req.vote.dislike === true) {
        return res.status(400).json({ error: 'sorry you have already disliked this article.' });
      }
      await Vote.update(dislikeData, { where: { vote_id: req.vote.vote_id } });
      return res.status(200).json({
        message: 'You have disliked this article.',
        userId: req.user.id,
        article: req.params.articleId,
      });
    } catch (error) {
      return res.status(500).json({ error: 'something wrong try again later.' });
    }
  }
}

export default VotesController;
