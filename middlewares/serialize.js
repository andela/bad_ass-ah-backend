const twitterUser = (passport, user) => {
  passport.serializeUser((userTwitwer, done) => {
    done(null, userTwitwer.username);
  });
  passport.deserializeUser((username, done) => {
    user.findByPk(username).then((userTwitwer) => {
      done(null, userTwitwer);
    })
      .catch(err => done(err, false));
  });
};
export default twitterUser;
