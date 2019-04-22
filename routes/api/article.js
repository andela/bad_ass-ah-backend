import express from 'express';
import passport from 'passport';
import Article from '../../controllers/article';
import Comment from '../../controllers/comment';
import multer from '../../middlewares/multerConfiguration';
import validateComment from '../../helpers/validateComment';
import checkComment from '../../middlewares/checkComment';
import Rate from '../../controllers/rate';
import UserAccount from '../../middlewares/userAccount';
import checkArticle from '../../middlewares/checkArticle';
import asyncHandler from '../../helpers/errors/asyncHandler';
import shareArticle from '../../helpers/shareArticles';
import reportArticle from '../../controllers/report/reportArticle';

import { checkingArticle, findArticleExist } from '../../middlewares/article';
import checkVote from '../../middlewares/votes';
import isAuth from '../../middlewares/isAuth';
import articleStats from '../../controllers/stats/articleStats';

import Votes from '../../controllers/votes';

const router = express.Router();
const auth = passport.authenticate('jwt', {
  session: false
});
// @Method POST
// @Desc create article
router.post('/', auth, multer, Article.create);
// @Method a given user can comment an article
router.post('/:articleId/comments/', auth, asyncHandler(checkArticle), validateComment, Comment.create);
// @Method get all comments related to a signle article
router.get('/:articleId/comments/', auth, asyncHandler(checkArticle), Comment.getAllComment);
// @Method update a given comment
router.put('/:idArticle/comments/:commentId', auth, checkComment, Comment.updateComment);
// @Mehtod delete a given comment
router.delete('/:idArticle/comments/:commentId', auth, checkComment, Comment.deleteComment);
router.post('/:articleId/like', auth, findArticleExist, checkVote, Votes.likes);
router.post('/:articleId/dislike', auth, findArticleExist, checkVote, Votes.dislikes);
// @Method GET
// @Desc get all created article
router.get('/', Article.getArticle);
// @Method GET
// @desc get single article
// router.get('/:articleId', isAuth, Article.singleArticle);
router.get('/:articleId', isAuth, asyncHandler(Article.singleArticle));
// @Method PUT
// @Desc update articles
router.put('/:articleId', auth, checkingArticle, multer, Article.updateArticle);
// @Method Delete
// @desc deleting articles
router.delete('/:articleId', auth, checkingArticle, Article.deleteArticle);

router.post('/:articleId/record-reading', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(articleStats.recordReading));

router.post('/:articleId/rate', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(Rate.rateArticle));

router.get('/:articleId/rate', asyncHandler(checkArticle), asyncHandler(Rate.getArticleRate));

router.post('/:articleId/report/type/:reportTypeId', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(reportArticle.reportArticle));

router.post('/:articleId/share/:url', auth, shareArticle.openChannelUrl);

export default router;
