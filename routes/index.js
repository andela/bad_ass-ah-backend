
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import users from './api/users';

const app = express();
// @router configuration
app.use('/api/users', users);
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
