
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import facebookAuth from './api/auth/facebook';

import users from './api/users';
import article from './api/article';

// @api
// @ initialize app
const app = express();
// @router configuration
app.use('/api/users/auth', facebookAuth);
app.use('/api/users', users);
app.use('/api/articles', article);
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', users);

export default app;
