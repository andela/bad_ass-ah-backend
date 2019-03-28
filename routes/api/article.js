import express from 'express';
import passport from 'passport';
import Article from '../../controllers/article';
import multer from '../../middlewares/multerConfiguration';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });
// @Method POST
// @Desc create article
router.post('/', auth, multer, Article.create);
// @Method GET
// @Desc get all created article
router.get('/', Article.getArticle);

export default router;
