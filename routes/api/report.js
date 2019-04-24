import { Router } from 'express';
import passport from 'passport';
import asyncHandler from '../../helpers/errors/asyncHandler';
import reportArticle from '../../controllers/report/reportArticle';
import { isAdmin } from '../../middlewares/user';

const router = Router();
const auth = passport.authenticate('jwt', { session: false });

router.get('/types', asyncHandler(reportArticle.getReportTypes));
router.post('/types', auth, isAdmin, asyncHandler(reportArticle.createReportType));
router.get('/articles', auth, isAdmin, asyncHandler(reportArticle.getReportedArticles));

export default router;
