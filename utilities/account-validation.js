const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Update Account Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const accountData = await accountModel.getAccountByEmail(account_email);
        if (accountData && accountData.account_id !== account_id) {
          throw new Error("Email already in use by another account.");
        }
      }),
  ];
};

/* **********************************
 * Change Password Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Update Account Information",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
      return
    }
    next()
  }

module.exports = validate;