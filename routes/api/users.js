import express from 'express';
// @controller
import user from '../../controllers/user';
// @middleware
import check from '../../middlewares/user';

const router = express.Router();
// @POST
// @description creating user
router.post('/', check, user.signup);


export default router;
