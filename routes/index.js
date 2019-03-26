import express from 'express';
import user from "./api/users";
//@create express router
const app = express.Router();
//@router configuration
app.use("/api/v1",user);

export default app;
