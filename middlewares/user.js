
import models from '../models/index';

const User = models.user;
const check = async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ where: { email: req.body.email } });
    if (userEmail) return res.status(400).json({ status: 400, error: 'email is already exist.' });
    const username = await User.findOne({ where: { username: req.body.username } });
    if (username) return res.status(400).json({ status: 400, error: 'username is already exist.' });
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default check;
