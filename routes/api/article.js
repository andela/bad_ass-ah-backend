import express from 'express';
import passport from 'passport';
import Article from '../../controllers/article';
import Comment from '../../controllers/comment';
import multer from '../../middlewares/multerConfiguration';
import { checkingArticle } from '../../middlewares/article';
import validateComment from '../../helpers/validateComment';
import checkArticle from '../../middlewares/checkArticle';
import checkComment from '../../middlewares/checkComment';


const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });
// @Method POST
// @Desc create article
router.post('/', auth, multer, Article.create);
// @Method a given user can comment an article
router.post('/:idArticle/comments/', auth, checkArticle, validateComment, Comment.create);
// @Method get all comments related to a signle article
router.get('/:idArticle/comments/', auth, checkArticle, Comment.getAllComment);
// @Method update a given comment
router.put('/:idArticle/comments/:commentId', auth, checkComment, Comment.updateComment);
// @Mehtod delete a given comment
router.delete('/:idArticle/comments/:commentId', auth, checkComment, Comment.deleteComment);
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
