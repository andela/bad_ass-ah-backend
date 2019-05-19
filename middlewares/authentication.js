import passport from 'passport';
import twitterStrategy from './passport-twitter';
import facebookStrategy from './passport-facebook';
import googleStrategy from './passport-google';
import socialMediaSerialize from './serialize';
/**
 * Get user information from the strategy and then pass it to serialize class
 */
class Authentication {
  /**
   * Authentication constructor
   */
  constructor() {
    this.twitter = passport.use(twitterStrategy);
    this.facebook = passport.use(facebookStrategy);
    this.google = passport.use(googleStrategy);
    this.serializeTwitteruser = socialMediaSerialize(passport, this.user);
  }
}
export default Authentication;
