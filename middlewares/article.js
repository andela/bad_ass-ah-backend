import models from '../models/index';

const Article = models.article;

/* @middleware which find if article is exist and
check if user is allowed to update or delete article
*/
export const checkingArticle = async (req, res, next) => {
  try {
    const findArticle = await Article.findByPk(req.params.articleId);
    if (!findArticle) {
      return res.status(404).json({ error: 'sorry the requested article could not be found.' });
    }
    // @check if authors are the same
    if (findArticle.author !== req.user.id) {
      return res.status(403).json({ error: 'permission denied, you are not allowed to perform this action.' });
    }
    req.findArticle = findArticle;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Something wrong please try again later.' });
  }
};
/* @middleware which find if article is exist only
*/
export const findArticleExist = async (req, res, next) => {
  try {
    const findArticle = await Article.findByPk(req.params.articleId);
    if (!findArticle) {
      return res.status(404).json({ error: 'sorry the requested article could not be found.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Something wrong please try again later.' });
  }
};
