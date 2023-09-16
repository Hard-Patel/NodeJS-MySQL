const { checkSchema } = require("express-validator");

module.exports = checkSchema({
  name: {
    in: ['body'],
    errorMessage: "Name should not be empty",
    isLength: {
        errorMessage: "Name must be between length of 3 to 50",
        options: {min: 3, max: 50},
    }
  },
  email: {
    in: ['body'],
    errorMessage: "please enter valid email",
    isEmail: true,
    isLength: {
        errorMessage: "email must be valid",
        options: {min: 3, max: 50},
    }
  },
  password: {
    in: ['body'],
    errorMessage: "Password should not be empty",
    isLength: {
        errorMessage: "Password must be between length of 4 to 20",
        options: {min: 4, max: 20},
    }
  }
});
