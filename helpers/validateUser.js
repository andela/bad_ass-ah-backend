class Validate {
  /**
   *
   * @param {object} input
   */
  static isEmpty(input) {
    return (input === undefined || input === null || (typeof input === 'object' && Object.keys(input).length === 0)
    || (typeof input === 'string' && input.trim().length === 0));
  }

  /**
   *
   * @param {object} input
   */
  static email(input) {
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return input.match(email);
  }

  /**
   *
   * @param {Object} input
   */
  static password(input) {
    return (input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/g));
  }
}

export default Validate;
