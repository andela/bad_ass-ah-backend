import express from 'express';
import passport from 'passport';
import googlePassport from './middlewares/passport-google';
import passportJwt from './middlewares/passport-jwt';
import router from './routes/index';
import passportAuth from './middlewares/passport-facebook';

const app = express();
const port = process.env.PORT || 3000;

// @bodyParser configuration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// @passport
app.use(passport.initialize());
googlePassport(passport);
passportAuth(passport);
passportJwt(passport);

// @router configuration --gracian
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
