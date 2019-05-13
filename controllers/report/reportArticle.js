import models from '../../models/index';
import httpError from '../../helpers/errors/httpError';
import validate from '../../helpers/validateUser';

const { reportType, reportArticle } = models;
/**
 * Controller for reporting article
 * @exports
 * @class
 */
class ArticleReport {
/**
* Create a new report type
* @param {object} req - Requests from user
* @param {object} res - Object that capture response
* @returns {object} Response
*/
  async createReportType(req, res) {
    const { type } = req.body;
    const validateType = validate.isEmpty(type);
    if (validateType) throw new httpError(400, 'Report type is required and should not be empty.');
    const typeFound = await reportType.findOne({ where: { type: type.trim() } });
    if (typeFound) throw new httpError(400, 'The report type exists.');
    const createdType = await reportType.create({ type });
    res.status(201).send({
      message: 'The new report type has successfully created.',
      id: createdType.id,
      type: createdType.type
    });
  }

  /**
 * Fetch report types
 * @param {object} req - Requests from user
 * @param {object} res - Object that capture response
 * @returns {object} Response
 */
  async getReportTypes(req, res) {
    const reportTypes = await reportType.findAll();
    if (reportTypes.length === 0) throw new httpError(404, 'Report types are not found.');
    res.status(200).send(reportTypes);
  }

  /**
 * Report article
 * @param {object} req - Requests from user
 * @param {object} res - Object that capture response
 * @returns {object} Response
 */
  async reportArticle(req, res) {
    const { articleId, reportTypeId } = req.params;
    let comment = req.body.comment.trim();
    if (validate.isEmpty(comment)) {
      comment = null;
    }
    const reporter = req.user.id;
    await validate.isInteger(reportTypeId, 'Report type Id');
    const type = await reportType.findByPk(parseInt(reportTypeId, 10));
    if (!type) throw new httpError(404, 'Report type is not found.');
    const reportResult = await reportArticle.findOrCreate({
      where: { articleId, reportTypeId, reporter }, defaults: { comment }
    });
    res.status(201).send({
      message: 'You have successfully reported the article',
      articleId: reportResult[0].articleId,
      reporter: reportResult[0].reporter,
      reportType: type.type,
      comment: reportResult[0].comment,
    });
  }

  /**
   * Fetch all reported articles
   * @param {object} req - Requests from user
   * @param {object} res - Object that capture response
   * @returns {object} Response
   */
  async getReportedArticles(req, res) {
    const reportedArticles = await reportArticle.findAll({
      attributes: ['id', 'articleId', 'reporter', 'comment'],
      include: [{ model: reportType, attributes: ['id', 'type'] }]
    });
    if (reportedArticles.length === 0) throw new httpError(404, 'reported articles are not found.');
    res.status(200).send(reportedArticles);
  }
}

export default ArticleReport;
