import passport from 'passport';
import twitterStrategy from './passport-twitter';
import twitteruser from './serialize';
/**
 * Get user information from the strategy and then pass it to serialize class
 */
class Authentication {
  /**
   * Authentication constructor
   */
  constructor() {
    this.twitter = passport.use(twitterStrategy);
    this.serializeTwitteruser = twitteruser(passport, this.user);
  }
}
export default Authentication;
