/* eslint-disable import/no-named-as-default */
import express from 'express';
import passport from 'passport';
import Article from '../../controllers/article';
import Comment from '../../controllers/comment';
import uploadImage from '../../middlewares/multerConfiguration';
import validateComment from '../../helpers/validateComment';
import checkComment from '../../middlewares/checkComment';
import Rate from '../../controllers/rate';
import UserAccount from '../../middlewares/userAccount';
import checkArticle from '../../middlewares/checkArticle';
import asyncHandler from '../../helpers/errors/asyncHandler';
import shareArticle from '../../helpers/shareArticles';
import ArticleReport from '../../controllers/report/reportArticle';

import {
  checkingArticle,
  findArticleExist
} from '../../middlewares/article';
import checkVote from '../../middlewares/votes';
import isAuth from '../../middlewares/isAuth';
import ArticleStats from '../../controllers/stats/articleStats';
import Highlights from '../../controllers/highlightText';
import checkArticleAuthor from '../../middlewares/checkArticleAuthor';
import validateHighlights from '../../middlewares/validateHighlights';
import Bookmark from '../../controllers/bookmark';

import VoteArticle from '../../controllers/votes';
import hasBookmarked from '../../middlewares/hasBookmarked';
import VoteComment from '../../controllers/commentLikes';
import likeComment from '../../middlewares/likeComments';

const article = new Article();
const bookmark = new Bookmark();
const comment = new Comment();
const voteComment = new VoteComment();
const highlights = new Highlights();
const rate = new Rate();
const voteArticle = new VoteArticle();
const articleReport = new ArticleReport();
const articleStats = new ArticleStats();

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
router.post('/', auth, uploadImage, article.create);
// @Method a given user can comment an article
router.post('/:articleId/comments/', auth, asyncHandler(checkArticle), validateComment, comment.create);
// @Method get all comments related to a signle article
router.get('/:articleId/comments/', auth, asyncHandler(checkArticle), comment.getAllComment);
// @Method update a given comment
router.put('/:idArticle/comments/:commentId', auth, checkComment, comment.updateComment);
// @Mehtod delete a given comment
router.delete('/:idArticle/comments/:commentId', auth, checkComment, comment.deleteComment);
router.post('/:articleId/like', auth, findArticleExist, checkVote, voteArticle.likeArticle);
router.post('/:articleId/dislike', auth, findArticleExist, checkVote, voteArticle.dislikeArticle);
// @Method get edited comment history
router.get('/:idArticle/comments/:commentId/edited', auth, checkComment, comment.getEditedComment);
// @Method GET
// @Desc get all created article
router.get('/', article.getArticle);
// @Method GET
// @desc get single article
router.get('/:articleId', isAuth, asyncHandler(hasBookmarked), asyncHandler(article.getSingleArticle));
router.get('/:articleId', isAuth, asyncHandler(article.getSingleArticle));
// @Method GET
// @desc get single comment
router.get('/:articleId/comments/:commentId', isAuth, asyncHandler(comment.getSingleComment));
router.post('/comments/:commentId/like', auth, likeComment, voteComment.likeComment);
router.post('/comments/:commentId/dislike', auth, likeComment, voteComment.dislikeComment);
// @Method PUT
// @Desc update articles
router.put('/:articleId', auth, checkingArticle, uploadImage, article.updateArticle);
// @Method Delete
// @desc deleting articles
router.delete('/:articleId', auth, checkingArticle, article.deleteArticle);

router.post('/:articleId/record-reading', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(articleStats.recordReading));

router.post('/:articleId/rate', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(rate.rateArticle));
router.get('/:articleId/rate', asyncHandler(checkArticle), asyncHandler(rate.getArticleRatings));
router.get('/:articleId/average-rating', asyncHandler(checkArticle), asyncHandler(rate.getArticleAverageRating));
router.get('/:articleId/user-article-rating', auth, asyncHandler(checkArticle), asyncHandler(rate.getUserArticleRating));

router.post('/:articleId/report/type/:reportTypeId', auth, asyncHandler(UserAccount.isUserAccountActivated), asyncHandler(checkArticle), asyncHandler(articleReport.reportArticle));

router.post('/:articleId/share/:url', auth, shareArticle.openChannelUrl);
router.get('/:articleId/share/email', auth, article.shareArticle);

router.post('/:articleId/highlights', auth, asyncHandler(checkArticle), asyncHandler(validateHighlights), asyncHandler(highlights.create));
router.get('/:articleId/user-highlights', auth, asyncHandler(checkArticle), asyncHandler(highlights.getUserHighlightedTexts));
router.get('/:articleId/highlights', auth, asyncHandler(checkArticle), asyncHandler(checkArticleAuthor), asyncHandler(highlights.getArticleHighlightedTexts));
router.put('/:articleId/highlights/:highlightId', auth, asyncHandler(checkArticle), asyncHandler(validateHighlights), asyncHandler(highlights.updateHighlightedText));

export default router;
