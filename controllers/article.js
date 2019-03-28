import models from '../models/index';

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
      author: parseInt(req.user.id, 11),
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
      .then(articles => res.status(200).json({ status: 200, articles }))
      .catch(error => res.status(500).json({ error }));
  }
}


export default ArticleController;
