
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import Users from './api/users';
import facebookAuth from './api/auth/facebook';


// @api
// @ initialize app
const app = express();
// @router configuration
app.use('/api/users', Users);
app.use('/api/users/auth', facebookAuth);
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', Users);

export default app;
