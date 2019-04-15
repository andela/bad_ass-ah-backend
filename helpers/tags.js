import model from '../models/index';

const Article = model.article;
const tagFetch = async (req) => {
  const { search } = req.query;
  const arr = [];
  const taglist = [];
  const tag = await Article.findAll({ attributes: ['taglist'] });
  tag.forEach((element) => {
    const list = element.taglist;
    list.forEach((ls) => {
      arr.push(ls);
    });
  });
  // find in tags
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf(search) !== -1) {
      taglist.push(arr[i]);
    }
  }
  return taglist;
};

export default tagFetch;
