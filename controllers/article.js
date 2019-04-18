import models from '../models/index';
import readingTime from '../helpers/readingTime';

const Article = models.article;
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
  static create(req, res) {
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
      .then((article) => {
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
  static getArticle(req, res) {
    Article.findAll()
      .then((articles) => {
        const articlesWithReadingTime = articles.map((article) => {
          article.dataValues.readingTime = readingTime(article.title + article.body);
          return article;
        });
        res.status(200).json({ status: 200, articles: articlesWithReadingTime });
      }).catch(error => res.status(500).json({ error }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  updated article
   * @returns {Object} return updated article
   */
  static updateArticle(req, res) {
    // @updating articles
    Article.update({
      title: req.body.title,
      body: req.body.body,
      taglist: (req.body.tag ? req.body.tag.split(',') : req.findArticle.taglist),
      image: (req.file ? req.file.url : null)
    }, { where: { article_id: req.params.articleId }, returning: true })
      .then(article => res.status(200).json({ status: 200, message: 'article updated successfully.', article: article[1] }))
      .catch(error => res.status(500).json({ error: `Something wrong please try again later.${error}` }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  delete article
   * @returns {Object} return message and status
   */
  static async deleteArticle(req, res) {
    Article.destroy({ where: { article_id: req.params.articleId } })
      .then(() => res.status(200).json({ status: 200, message: 'article deleted successfully.' }))
      .catch(error => res.status(500).json({ error: `Something wrong please try again later. ${error}` }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  view single article
   * @returns {Object} return article
   */
  static singleArticle(req, res) {
    Article.findByPk(req.params.articleId)
      .then((article) => {
        if (!article) {
          return res.status(404).json({ error: 'Sorry the requested resource could not be found.' });
        }
        article.dataValues.readingTime = readingTime(article.title + article.body);
        // @return article
        return res.status(200).json({ status: 200, article });
      });
  }
}


export default ArticleController;
