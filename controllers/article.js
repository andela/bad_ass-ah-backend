import dotenv from 'dotenv';
import models from '../models/index';
import readingTime from '../helpers/readingTime';
import httpError from '../helpers/errors/httpError';
import Notification from './notification';
import shareTemplate from '../helpers/sendEmail/emailTemplates';
import Mailer from '../helpers/sendEmail/mailer';

const { shareArticleTemplate } = shareTemplate;
const notification = new Notification();

const {
  article: Article,
  articleStats: ArticleStats,
  vote: Votes,
  user: User
} = models;

dotenv.config();
const { SHARE_WITH } = process.env;

const mailOptions = {
  // eslint-disable-next-line arrow-body-style
  to: '',
  from: process.env.SENDER_EMAIL,
  subject: 'Share an article with',
  html: ''
};
/**
 * @param {class} --Article controller
 */
class ArticleController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} this will return created articles
   */
  create(req, res) {
    // @initial article
    const newArticle = {
      title: req.body.title,
      body: req.body.body,
      taglist: (req.body.tag ? req.body.tag.split(',') : null),
      author: req.user.id,
      image: (req.file ? req.file.url : null)
    };
    // @save articles
    Article.create(newArticle)
      .then(async (article) => {
        const user = await User.findOne({
          where: {
            id: article.author
          }
        });
        const message = `${user.username} published a new article`;
        await notification.createNotificationForFavorite(article.author, message);
        await notification.sendNotificationToFollower(article.author, message);
        res.status(201).json({ status: 201, message: 'Article created successfully', article });
      })
      .catch(error => res.status(500).json({ error: `something wrong please try again. ${error}` }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  get all created article
   * @returns {Object} return all created article
   */
  getArticle(req, res) {
    const {
      page = 1
    } = req.query;
    const {
      limit = 20
    } = req.query;
    Article.findAndCountAll({
      offset: (Number(page) - 1) * Number(limit),
      limit,
      include: [
        {
          model: User,
          as: 'authorfkey',
          attributes: ['username', 'email', 'image', 'id', 'bio']
        }
      ]
    })
      .then(articles => res.status(200).json({
        status: 200,
        articles: articles.rows,
        metaData: {
          prevPage: page > 1 ? page - 1 : null,
          nextPage: Math.ceil(articles.count / limit) > page ? parseInt(page, 10) + 1 : null,
          currentPage: page,
          totalPages: Math.ceil(articles.count / limit),
          limit
        }
      }))
      .catch((error) => {
        console.log(error);
      });
    // .catch(error => res.status(500).json({ error }));
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} - will return an object
   */
  shareArticle(req, res) {
    mailOptions.to = SHARE_WITH;
    mailOptions.html = shareArticleTemplate(req.params.articleId);
    const mailer = new Mailer();
    const sendEmail = mailer.sendEmail(mailOptions);
    return res.status(200).json({ sendEmail, status: 200, message: `You have share an article with ${SHARE_WITH}` });
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  updated article
   * @returns {Object} return updated article
   */
  updateArticle(req, res) {
    // @updating articles
    Article.update({
      title: req.body.title,
      body: req.body.body,
      taglist: (req.body.tag ? req.body.tag.split(',') : req.findArticle.taglist),
      image: (req.file ? req.file.url : null)
    }, {
      where: {
        article_id: req.params.articleId
      },
      returning: true
    })
      .then(async (article) => {
        const message = `Article with title "${article[1][0].title}" has been updated`;
        await notification.createNotificationForFavorite(article[1][0].article_id,
          message, article[1][0].author);
        await notification.sendNotificationToFavorites(article[1][0].article_id,
          message, article[1][0].author);
        res.status(200).json({
          status: 200,
          message: 'article updated successfully.',
          article: article[1]
        });
      }).catch(error => res.status(500).json({
        error: `Something wrong please try again later.${error}`
      }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  delete article
   * @returns {Object} return message and status
   */
  async deleteArticle(req, res) {
    Article.destroy({
      where: {
        article_id: req.params.articleId
      }
    })
      .then(() => res.status(200).json({
        status: 200,
        message: 'article deleted successfully.'
      }))
      .catch(error => res.status(500).json({
        error: `Something wrong please try again later. ${error}`
      }));
  }

  /**
   * Get a single article
   * @param {Object} req - Request from user
   * @param {Object} res - view single article
   * @returns {Object} return article
   */
  async getSingleArticle(req, res) {
    const user = req.user.id;
    const { hasBookmarked } = req;
    const {
      articleId
    } = req.params;
    const article = await Article.findByPk(articleId, {
      include: [
        {
          model: User,
          as: 'authorfkey',
          attributes: ['username', 'email', 'image', 'id', 'bio']
        }
      ]
    });
    if (!article) {
      throw new httpError(404, 'Sorry the requested resource could not be found.');
    }
    article.dataValues.readingTime = readingTime(article.title + article.body);
    const likes = await Votes.count({ where: { article: articleId, like: true } });
    const dislikes = await Votes.count({ where: { article: articleId, dislike: true } });
    // eslint-disable-next-line object-curly-newline
    const votes = { likes, dislikes, hasLiked: false, hasDisliked: false };
    if (user !== undefined) {
      const userVotes = await Votes.findOne({ where: { article: articleId, user }, attributes: ['like', 'dislike'] });
      if (userVotes) { votes.hasLiked = userVotes.like; votes.hasDisliked = userVotes.dislike; }
    }
    const totalReading = await ArticleStats.count({
      where: { articleId: req.params.articleId }
    });
    // eslint-disable-next-line object-curly-newline
    res.status(200).json({ status: 200, article, totalReading, hasBookmarked, votes });
  }
}


export default ArticleController;
