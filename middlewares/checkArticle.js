import models from '../models/index';


const Article = models.article;

const check = async (req, res, next) => {
  try {
    const findArticle = await Article.findByPk(req.params.idArticle);
    if (!findArticle) {
      return res.status(404).json({ status: 404, error: 'sorry the requested article could not be found.' });
    }
    // @check if authors are the same
    req.findArticle = findArticle;
    next();
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

export default check;
