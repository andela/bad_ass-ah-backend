import models from '../models/index';
import httpError from '../helpers/errors/httpError';

const Article = models.article;

/**
 * Check Article's owner
 * @param {object} req - Request made by the user
 * @param {object} res - Object that capture response
 * @param {callback} next - allow other functionalities to run
 * @returns {object} response
 */
const checkArticleAuthor = async (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user.id;
  const article = await Article.findByPk(parseInt(articleId, 10));
  if (article.author !== userId) throw new httpError(403, 'Not allowed: The article is not yours');
  next();
};

export default checkArticleAuthor;
