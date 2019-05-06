import models from '../../models/index';

const { articleStats } = models;

/**
 * Article stats controller
 * @exports
 * @class
 */
class ArticleStats {
  /**
   * Record user reading stats
   * @param {object} req - user's request
   * @param {object} res - response
   * @return {object} response
   */
  async recordReading(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const [result, created] = await articleStats.findOrCreate({
      where: { userId, articleId }, defaults: { numberOfReading: 1 }
    });
    if (!created) {
      const [, updatedStats] = await articleStats.update(
        { numberOfReading: result.numberOfReading + 1 },
        { where: { id: result.id }, returning: true }
      );
      result.numberOfReading = updatedStats[0].numberOfReading;
      result.updatedAt = updatedStats[0].updatedAt;
    }
    res.status(201).send({
      message: 'You are reading the article',
      articleId: result.articleId,
      userId: result.userId
    });
  }

  /**
   * Get user reading stats
   * @param {object} req - user's request
   * @param {object} res - response
   * @return {object} response
   */
  async getUserReadingStats(req, res) {
    const totalUserReadingStats = await articleStats.count({ where: { userId: req.user.id } });
    res.status(200).send({
      totalReading: totalUserReadingStats
    });
  }
}

export default ArticleStats;
