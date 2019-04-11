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
async function checkArticle(req, res, next) {
  const { articleId } = req.params;
  await validate.isInteger(articleId, 'Article');
  const article = await Article.findByPk(parseInt(articleId, 10));
  if (article) {
    req.findArticle = article;
    next();
  } else {
    throw new httpError(404, 'Article not found');
  }
}

export default checkArticle;
