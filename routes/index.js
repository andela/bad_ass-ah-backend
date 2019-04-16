
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import facebookAuth from './api/auth/facebook';
import twitterAuth from './api/auth/twitter';

import users from './api/users';
import article from './api/article';
import search from './api/search';
import report from './api/report';

// @api
// @ initialize app
const app = express();
// @router configuration
app.use('/api/users/auth', facebookAuth);
app.use('/api/users', twitterAuth);
app.use('/api/users', users);
app.use('/api/articles', article);
app.use('/api/search', search);
app.use('/api/report', report);
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', users);

export default app;
