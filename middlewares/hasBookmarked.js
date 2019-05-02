import models from '../models/index';

const { bookmark } = models;

const hasBookmarked = async (req, res, next) => {
  const userId = req.user.id || 0;
  const { articleId } = req.params;
  req.hasBookmarked = false;
  const userBookmark = await bookmark.findOne({ where: { userId, articleId } });
  if (userBookmark) {
    req.hasBookmarked = true;
  }
  next();
};

export default hasBookmarked;
