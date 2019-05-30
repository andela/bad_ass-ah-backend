import model from '../models/index';

const User = model.user;
const activation = async (req, res, type, statusType, id) => {
  const data = await User.update({ status: statusType }, { where: { id }, returning: true });
  return res.status(200).json({ status: 200, message: `account is ${type}`, data });
};

const Access = async (req, res, access, id) => {
  User.update({ isAdmin: access }, { where: { id }, returning: true })
    .then(user => res.status(200).json({ status: 200, message: 'permission has been granted', user }))
    .catch(error => res.status(500).json({ status: 500, error: `something wrong try again.${error}` }));
};

export { activation, Access };
