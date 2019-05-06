import { Router } from 'express';
import passport from 'passport';
import asyncHandler from '../../helpers/errors/asyncHandler';
import ArticleReport from '../../controllers/report/reportArticle';
import { checkAdmin } from '../../middlewares/user';

const articleReport = new ArticleReport();
const router = Router();
const auth = passport.authenticate('jwt', { session: false });

router.get('/types', asyncHandler(articleReport.getReportTypes));
router.post('/types', auth, checkAdmin, asyncHandler(articleReport.createReportType));
router.get('/articles', auth, checkAdmin, asyncHandler(articleReport.getReportedArticles));

export default router;
