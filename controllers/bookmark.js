import models from '../models/index';


const { bookmark, article, user } = models;
/**
   * @description Controller for Bookmarking
   * @exports
   * @class
   */
class Bookmark {
/**
   * @description It helps the user to bookmark the article for reading it later.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */
  async createBookmark(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    try {
      const [bookmarks, created] = await bookmark.findOrCreate({ where: { userId, articleId } });
      if (created) {
        return res.status(201).json({ message: 'Successfully bookmarked', bookmarks });
      }
      await bookmark.destroy({ where: { userId, articleId } });
      res.status(200).json({ message: 'Successfully unbookmarked!' });
    } catch (error) {
      res.status(500).json('Something went wrong, try again');
    }
  }

  /**
   * @description It helps the user to bookmark the article for reading it later.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */
  async allBookmark(req, res) {
    const userId = req.user.id;
    try {
      const allBookmarks = await bookmark.findAll({
        where: { userId },
        include: [{ model: article, include: [{ model: user, as: 'authorfkey' }] }]
      });
      if (allBookmarks.length === 0) return res.status(404).json({ message: 'Bookmark not found!' });
      res.status(200).json(allBookmarks);
    } catch (error) {
      res.status(500).json('Something went wrong, try again');
    }
  }
}

export default Bookmark;
