import passport from 'passport';

const isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      next(error);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default isAuth;
