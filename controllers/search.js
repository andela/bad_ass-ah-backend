import Sequelize from 'sequelize';
import model from '../models/index';


const { Op } = Sequelize;
// @assign model
const User = model.user;
const Article = model.article;
/**
  * @param {class} --Search controller
  */
class searchController {
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} all item related to item
 */
  async searchItem(req, res) {
    // item from req.query
    const { search } = req.query;
    try {
    // first lets search from user
      const user = await User.findAll({
        attributes: { exclude: ['password', 'isAdmin', 'isActivated', 'createdAt', 'updatedAt'] },
        where: { username: { [Op.like]: `%${search}%` } },
        include: [{ model: Article }]
      });
      const article = await Article.findAll({
        where: { title: { [Op.like]: `%${search}%` } },
        include: [{
          model: User,
          as: 'authorfkey',
          attributes: { exclude: ['password', 'isAdmin', 'isActivated', 'createdAt', 'updatedAt'] }
        }]
      });
      return res.status(200).json({
        status: 200, user, article
      });
    } catch (error) {
      return res.status(500).json({ error: `something wrong try again later ${error}` });
    }
  }
}
export default searchController;
