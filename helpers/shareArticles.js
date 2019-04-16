import open from 'open';
/**
 * @shareArticle
 */
class Share {
  /**
   *
   * @param {Object} req
   * @param {Ojbect} res
   * @returns {Object} kdjdjd
   */
  async openChannelUrl(req) {
    if (req.params.url === 'twitter') {
      const result = await open('https://twitter.com/intent/tweet?text=https://badass-ah-backend-staging.herokuapp.com/api/articles');
      return result;
    } if (req.params.url === 'facebook') {
      const result = await open('https://www.facebook.com/sharer/sharer.php?u=https://badass-ah-backend-staging.herokuapp.com/api/articles');
      return result;
    } if (req.params.url === 'linkedin') {
      const result = await open('https://www.linkedin.com/sharing/share-offsite/?url=https://badass-ah-backend-staging.herokuapp.com/api/articles');
      return result;
    }
  }
}
export default new Share();
