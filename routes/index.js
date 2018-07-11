
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import Users from './api/users';

// @api
// @ initialize app
const app = express();
// @router configuration
app.use('/api/users', Users);
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', Users);

export default app;
