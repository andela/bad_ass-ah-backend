import express from "express";
const router=express.Router();
//@controller 
import user from "../../controllers/user";
//@middleware
import {checkEmail,checkUsername} from "../../middleware/user";
//@POST
//@description creating user
router.post("/users", checkEmail,checkUsername,user.signup);


export default router;
