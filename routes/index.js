import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';


//@router 
import user from "./api/users";

// @api
// @ initialize app
const app = express();

//@bodyParser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// @ add package configurations
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//@router configuration
app.use("/api/v1",user);

export default app;
