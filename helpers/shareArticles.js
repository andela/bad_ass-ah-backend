import open from 'open';
import dotenv from 'dotenv';

dotenv.config();
const { SHARING_HOST } = process.env;
/**
 * @shareArticle
 */
class Share {
  /**
   *
   * @param {Object} req
   * @param {Ojbect} res
   * @returns {Object} -- will return an object
   */
  async openChannelUrl(req) {
    const completeSahringHost = `${SHARING_HOST}${req.params.articleId}`;
    if (req.params.url === 'twitter') {
      const result = await open(`https://twitter.com/intent/tweet?text=${completeSahringHost}`);
      return result;
    } if (req.params.url === 'facebook') {
      const result = await open(`https://www.facebook.com/sharer/sharer.php?u=${completeSahringHost}`);
      return result;
    } if (req.params.url === 'linkedin') {
      const result = await open(`https://www.linkedin.com/sharing/share-offsite/?url=${completeSahringHost}`);
      return result;
    } if (req.params.url === 'gmail') {
      const result = await open(`mailto:?subject=artcileTile&body=${completeSahringHost}`);
      return result;
    }
  }
}
export default new Share();
