import models from '../models/index';
import validate from '../helpers/validateUser';

const { rate } = models;

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
    try {
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
    } catch (err) {
      const errStatus = err.statusCode || 500;
      const errMsg = errStatus === 500 ? 'Something Failed, try again!' : err.message;
      res.status(errStatus).send({ errors: { body: [errMsg] } });
    }
  }
}

export default Rate;
