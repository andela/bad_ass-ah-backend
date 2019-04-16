import twitterStrategy from 'passport-twitter';
import dotenv from 'dotenv';

dotenv.config();
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_CALLBACK_URL } = process.env;
// const User = models.user;

const twStrategy = new twitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: TWITTER_CALLBACK_URL
  },
  (token, tokenSecret, profile, done) => {
    const userTwitter = {
      username: profile._json.name
    };
    done(null, userTwitter);
  }
);

export default twStrategy;
