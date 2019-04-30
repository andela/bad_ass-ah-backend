import models from '../models/index';
import httpError from '../helpers/errors/httpError';

const { articleHighlights, user, article } = models;

/**
 * Controller for highlighting articles
 * @exports
 * @class
 */
class HighlightText {
  /**
   * create a highlighted article section
   * @param {object} req - User's request
   * @param {object} res - Response's holder
   * @returns {Object} response
   */
  async create(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const {
      indexStart, indexEnd, text, comment
    } = req.body;
    const [highlightedText, created] = await articleHighlights.findOrCreate({
      where: {
        articleId, userId, indexStart, indexEnd, text
      },
      defaults: { comment }
    });
    if (!created) {
      throw new httpError(409, 'You have already highlighted the same section of the article');
    }
    res.status(201).send({
      message: 'You successfully highlighted a part of this article',
      highlightedText
    });
  }

  /**
   * Get all highlighted texts of an article
   * @param {object} req - User's request
   * @param {object} res - Response's holder
   * @returns {object} Response
   */
  async getArticleHighlightTexts(req, res) {
    const { articleId } = req.params;
    const userId = req.user.id;
    const highlightedTexts = await articleHighlights.findAll({
      where: { articleId },
      attributes: ['indexStart', 'indexEnd', 'text', 'comment'],
      include: [
        { model: article, where: { author: userId }, attributes: [['article_id', 'id'], 'author'] },
        { model: user, attributes: ['id', 'username'] }
      ]
    });
    if (highlightedTexts.length === 0) throw new httpError(404, 'No highlighted texts found.');
    res.status(200).send(highlightedTexts);
  }

  /**
   * Update highlighted text on a particular article
   * @param {object} req - User's request
   * @param {object} res - Response's holder
   * @returns {object} Response
   */
  async updateHighlightText(req, res) {
    const userId = req.user.id;
    const { articleId, highlightId } = req.params;
    const {
      indexStart, indexEnd, text, comment
    } = req.body;
    const highlightedTextToUpdate = await articleHighlights.findOne({
      where: { id: highlightId }
    });
    if (highlightedTextToUpdate.userId !== userId) throw new httpError(403, 'You cannot update the highlighted text which you did not create');
    const [, updatedHighlightedText] = await articleHighlights.update(
      {
        indexStart, indexEnd, text, comment
      },
      { where: { id: highlightId, articleId }, returning: true }
    );
    res.status(200).send({
      message: 'You successfully updated the highlighted section of this article',
      highlightedText: updatedHighlightedText
    });
  }

  /**
   * Get a user's highlight
   * @param {object} req
   * @param {object} res
   * @returns {object} Response
   */
  async getUserHighlightedTexts(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const highlightedText = await articleHighlights.findAll({ where: { articleId, userId } });
    if (highlightedText.length === 0) throw new httpError(404, 'Not found. You have not highlighted any section of this article');
    res.status(200).send(highlightedText);
  }
}

export default new HighlightText();
