import httpError from './errors/httpError';

/**
 * Validate user email and password
 * @exports
 * @class
 */
class Validate {
  /**
   * Checks if the input fields are empty
   * @param {object} input
   * @return {boolean} true or false
   */
  static isEmpty(input) {
    return (
      input === undefined || input === null || (typeof input === 'object' && Object.keys(input).length === 0)
    || (typeof input === 'string' && input.trim().length === 0));
  }

  /**
   * Checks if the email is valid
   * @param {object} input
   * @return {boolean} true or false
   */
  static email(input) {
    const email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    return input.match(email);
  }

  /**
   * Checks if the password is valid
   * @param {Object} input
   * @return {boolean} true or false
   */
  static password(input) {
    return (input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/g));
  }

  /**
   * Test if a given number is an integer
   * @param {number} intNumber - given integer number to test
   * @param {string} intNumberFor - a string refers to what the number is for
   * @returns {boolean} true or false
   */
  static isInteger(intNumber, intNumberFor) {
    const regInteger = /^[0-9]{1,}?$/;
    return new Promise(async (resolve, reject) => {
      if (regInteger.test(intNumber)) {
        resolve(true);
      } else {
        const error = new httpError(400, `Failed: given value "${intNumber}" for ${intNumberFor} must be an integer`);
        reject(error);
      }
    });
  }


  /**
   * Validate user's rating
   * @param {number} rating - User ratings
   * @returns {Promise} resolve or reject
   */
  static validateRate(rating) {
    return new Promise((resolve, reject) => {
      const regForRating = /^[1-5]{1}?$/;
      if (!regForRating.test(rating)) {
        const error = new httpError(400, 'Rating must be integer between 1 and 5');
        reject(error);
      }
      resolve(true);
    });
  }
}
export default Validate;
