import passport from 'passport';
import twitterStrategy from './passport-twitter';
import twitteruser from './serialize';
/**
 * dsad
 */
class Authentication {
  /**
   * sdfdf
   */
  constructor() {
    this.twitter = passport.use(twitterStrategy);
    this.serializeTwitteruser = twitteruser(passport, this.user);
  }
}
export default Authentication;
