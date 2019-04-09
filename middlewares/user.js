
import models from '../models/index';

const User = models.user;
const check = async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ where: { email: req.body.email } });
    if (userEmail) return res.status(409).json({ status: 409, error: 'email is already exist.' });
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default check;
