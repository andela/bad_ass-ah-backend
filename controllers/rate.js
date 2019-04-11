import models from '../models/index';
import validate from '../helpers/validateUser';
import httpError from '../helpers/errors/httpError';

const { rate, user } = models;

/**
 * Controller for rating article
 * @exports
 * @class
 */
class Rate {
  /**
   * Rate a particular article
   * @param {object} req - user's request
   * @param {object} res - response
   * @return {object} response
   */
  static async rateArticle(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const rating = parseInt(req.body.rating, 10);
    await validate.validateRate(rating);
    const [ratings, created] = await rate.findOrCreate({
      where: { userId, articleId }, defaults: { rating }
    });
    if (!created) {
      const [, updatedRating] = await rate.update(
        { rating },
        { where: { id: ratings.id }, returning: true }
      );
      ratings.rating = updatedRating[0].rating;
      ratings.updatedAt = updatedRating[0].updatedAt;
    }
    res.status(201).send({ ratings });
  }

  /**
 * Fetch a particular article's ratings
 * @param {object} req - user's request
 * @param {object} res - response
 * @return {object} response
 */
  static async getArticleRate(req, res) {
    const { articleId } = req.params;
    const ratings = await rate.findAll({
      where: { articleId },
      attributes: ['articleId', 'rating', 'updatedAt'],
      include: [{ model: user, attributes: ['id', 'username', 'bio'] }]
    });
    if (ratings.length === 0) throw new httpError(404, 'Not found: Article has not rated');
    res.status(200).send({ ratings });
  }
}

export default Rate;
