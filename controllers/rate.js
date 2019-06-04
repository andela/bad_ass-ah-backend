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
  async rateArticle(req, res) {
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
  async getArticleRatings(req, res) {
    let page, limit;
    if (Object.keys(req.query).length === 0) {
      page = 1; limit = 20;
    } else if (req.query.limit === undefined) {
      ({ page } = req.query); limit = 20;
    } else ({ page, limit } = req.query);
    const allRatings = await rate.findAll({ where: { articleId: req.params.articleId } });
    const ratings = await rate.findAll({
      where: { articleId: req.params.articleId },
      attributes: ['articleId', 'rating', 'updatedAt'],
      include: [{ model: user, attributes: ['id', 'username', 'bio'] }],
      offset: ((parseInt(page, 10) - 1) * limit),
      limit
    });
    if (ratings.length === 0) throw new httpError(404, 'Not found: Article has not rated');
    res.status(200).send({
      ratings,
      meta_data: {
        currentPage: parseInt(page, 10),
        previousPage: parseInt(page, 10) > 1 ? parseInt(page, 10) - 1 : null,
        nextPage: Math.ceil(allRatings.length / limit) > page ? parseInt(page, 10) + 1 : null,
        totalPages: Math.ceil(allRatings.length / limit),
        limit: parseInt(limit, 10)
      }
    });
  }

  /**
   * Fetch average rating on a particular article
   * @param {object} req - user's request
   * @param {object} res - response
   * @return {object} response
   */
  async getArticleAverageRating(req, res) {
    const { articleId } = req.params;
    const ratings = await rate.findAll({
      where: { articleId },
      attributes: ['userId', 'rating'],
    });

    if (ratings.length === 0) throw new httpError(404, 'Not found: Article has not rated');

    const totalRating = ratings.map(rating => rating.rating)
      .reduce((sum, rating) => sum + rating, 0);

    const average = (totalRating / ratings.length).toFixed(1);

    res.status(200).send({
      rating: {
        average,
        rates: totalRating,
        raters: ratings.length
      }
    });
  }

  /**
   * Fetch user rating on a particular article
   * @param {object} req - user's request
   * @param {object} res - response
   * @return {object} response
   */
  async getUserArticleRating(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const rating = await rate.findOne({
      where: { articleId, userId }
    });
    if (!rating) throw new httpError(404, 'Not found: You have not rated this article');
    res.status(200).send({
      rating,
    });
  }
}

export default Rate;
