import express from 'express';
// @controller
import user from '../../controllers/user';
// @middleware
import { checkEmail, checkUsername } from '../../middleware/user';

const router = express.Router();
// @POST
// @description creating user
router.post('/users', checkEmail, checkUsername, user.signup);


export default router;
