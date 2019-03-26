import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import router from "./routes/index";
const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);

//@bodyParser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// @ add package configurations
// @swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//@router configuration --gracian
app.use(router);

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'resource not found',
  });
});
app.listen(port, () => {
  console.log(`Server started successfully on ${port}`);
});

export default app;
