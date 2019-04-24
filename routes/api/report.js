import { Router } from 'express';
import passport from 'passport';
import asyncHandler from '../../helpers/errors/asyncHandler';
import reportArticle from '../../controllers/report/reportArticle';
import userAccount from '../../middlewares/userAccount';

const router = Router();
const auth = passport.authenticate('jwt', { session: false });

router.get('/types', asyncHandler(reportArticle.getReportTypes));
router.post('/types', auth, asyncHandler(userAccount.isUserAdmin), asyncHandler(reportArticle.createReportType));
router.get('/articles', auth, asyncHandler(userAccount.isUserAdmin), asyncHandler(reportArticle.getReportedArticles));

export default router;
