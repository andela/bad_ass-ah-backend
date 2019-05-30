import twitterStrategy from 'passport-twitter';
import dotenv from 'dotenv';

dotenv.config();
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, APP_URL } = process.env;

const twStrategy = new twitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: `${APP_URL}api/users/login/twitter/redirect`
  },
  (token, tokenSecret, profile, done) => {
    const userTwitter = {
      username: profile._json.name
    };
    done(null, userTwitter);
  }
);

export default twStrategy;
