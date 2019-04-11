import express from 'express';
import passport from 'passport';
import Article from '../../controllers/article';
import multer from '../../middlewares/multerConfiguration';
import { checkingArticle } from '../../middlewares/article';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });
// @Method POST
// @Desc create article
router.post('/', auth, multer, Article.create);
// @Method GET
// @Desc get all created article
router.get('/', Article.getArticle);
// @Method GET
// @desc get single article
router.get('/:articleId', Article.singleArticle);
// @Method PUT
// @Desc update articles
router.put('/:articleId', auth, checkingArticle, multer, Article.updateArticle);
// @Method Delete
// @desc deleting articles
router.delete('/:articleId', auth, checkingArticle, Article.deleteArticle);

export default router;
