
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

// @check if user is Admin
const checkAdmin = (req, res, next) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (user.isAdmin !== true) {
        return res.status(403).json({ status: 403, message: 'Permission denied, You are not allowed to perform this action.' });
      }
      next();
    })
    .catch(error => res.status(500).json({ status: 500, error: `something wrong please try again.${error}` }));
};
// @check if account is enabled
const accountActivation = async (req, res, next) => {
  try {
    const find = await User.findOne({ where: { id: req.user.id } });
    // @check if status is true
    if (find.status !== true) {
      return res.status(403).json({ status: 403, message: 'Sorry Your Account was disabled.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'somthing wrong please try again.' });
  }
};
// @this middleware check  whether user is manager or not
const checkManager = async (req, res, next) => {
  const find = await User.findOne({ where: { id: req.user.id } });
  if (find.isAdmin !== true || find.isManager !== true) {
    return res.status(403).json({
      status: 403,
      message: 'Permission denied , this action must be performed when you have access.'
    });
  }
  next();
};
// @this stop manager to change access of Another manager
// @ we will take id from params and use it to check if user is manager
const checkIfBothAreManagers = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.userId } });
  if (user.isManager === true) {
    return res.status(403).json({
      status: 403,
      message: 'Permission denied , You are not allowed to change role of this user.'
    });
  }
  next();
};
export {
  check,
  checkAdmin,
  accountActivation,
  checkManager,
  checkIfBothAreManagers
};
