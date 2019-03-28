class Validate {
  static email(input, required) {
    if (!input && !required) {
      return {
        isValid: true,
      };
    }

    const re = /[A-Z]+@[A-Z-]+\.[A-Z]{2,4}/igm;
    const re1 = /[\\ ,;:"!#$%&'*+/=?^`{|}~]/g;
    const re2 = /[\d+ \\,;:"!#$%&'*+/=?^`{|}~]/g;
    const re3 = /[\d+ \\,;:"!#$%&'*+-/=?^_`{|}~]/g;

    const emailPart1 = input.substring(0, input.lastIndexOf('@'));
    const emailPart2 = input.substring(input.lastIndexOf('@') + 1, input.lastIndexOf('.'));
    const emailPart3 = input.substring(input.lastIndexOf('.') + 1);

    if (re.test(input) && !re1.test(emailPart1) && !re2.test(emailPart2) && !re3.test(emailPart3)) {
      return true;
    }

    return {
      isValid: false,
      error: 'Please use a valid email address',
    };
  }

  static password(input, required) {
    if (!input && !required) {
      return {
        isValid: true,
      };
    }
    if (input.match(/^(?=.\d)(?=.[a-z])(?=.[A-Z]).{8,}$/) && input.match(/[ \\,;:"!#$%&'+-/=?^_`{|}~]/)) {
      return {
        isValid: true,
      };
    }
    return {
      isValid: false,
      error: 'Your password should have at least 8 caracters, and it should contain uppercase, lowercase, a number and a special character (*&^!%$@#)',

    };
  }
}

export default Validate;
