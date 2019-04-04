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
}
export default Validate;
