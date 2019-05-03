/* eslint-disable import/no-named-as-default */
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

import {
  checkingArticle,
  findArticleExist
} from '../../middlewares/article';
import checkVote from '../../middlewares/votes';
import isAuth from '../../middlewares/isAuth';
import articleStats from '../../controllers/stats/articleStats';
import highlightText from '../../controllers/highlightText';
import checkArticleAuthor from '../../middlewares/checkArticleAuthor';
import validateHighlights from '../../middlewares/validateHighlights';
import bookmark from '../../controllers/bookmark';

import Votes from '../../controllers/votes';
import hasBookmarked from '../../middlewares/hasBookmarked';

const router = express.Router();
const auth = passport.authenticate('jwt', {
  session: false
});
// @GET all bookmarks
router.get('/bookmark', auth, bookmark.allBookmark);
// @POST a bookmark
router.post('/:articleId/bookmark', auth, asyncHandler(checkArticle), bookmark.createBookmark);
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
// @Method get edited comment history
router.get('/:idArticle/comments/:commentId/edited', auth, checkComment, Comment.getEditedComment);
// @Method GET
// @Desc get all created article
router.get('/', Article.getArticle);
// @Method GET
// @desc get single article
// router.get('/:articleId', isAuth, Article.singleArticle);
router.get('/:articleId', isAuth, asyncHandler(hasBookmarked), asyncHandler(Article.singleArticle));
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
router.get('/:articleId/share/email', auth, Article.shareEmail);

router.post('/:articleId/highlights', auth, asyncHandler(checkArticle), asyncHandler(validateHighlights), asyncHandler(highlightText.create));
router.get('/:articleId/user-highlights', auth, asyncHandler(checkArticle), asyncHandler(highlightText.getUserHighlightedTexts));
router.get('/:articleId/highlights', auth, asyncHandler(checkArticle), asyncHandler(checkArticleAuthor), asyncHandler(highlightText.getArticleHighlightTexts));
router.put('/:articleId/highlights/:highlightId', auth, asyncHandler(checkArticle), asyncHandler(validateHighlights), asyncHandler(highlightText.updateHighlightText));

export default router;
