import models from '../models/index';
import validate from '../helpers/validateUser';
import httpError from '../helpers/errors/httpError';

const Article = models.article;

/**
 * Check Article
 * @param {object} req - Request made by the user
 * @param {object} res - Object that capture response
 * @param {callback} next - allow other functionalities to run
 * @returns {object} response
 */
const checkArticle = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    await validate.isInteger(articleId, 'Article');
    const article = await Article.findByPk(parseInt(articleId, 10));
    if (article) {
      next();
    } else {
      const error = new httpError(404, 'Article not found');
      throw error;
    }
  } catch (err) {
    const errStatus = err.statusCode || 500;
    const errMsg = errStatus === 500 ? 'Something failed: Try again!' : err.message;
    res.status(errStatus).send({
      status: errStatus,
      errors: {
        body: [errMsg]
      }
    });
  }
};
export default checkArticle;
