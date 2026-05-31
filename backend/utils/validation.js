const model = require("../models");


exports.notNull = (value) => {

  if (value) {
    return true;
  }

  const err = new Error(
    "Please input the required field"
  );

  err.status = 400;

  throw err;
};


exports.emailValidation = (email) => {

  if (
    email &&
    email.includes("@") &&
    email.includes(".com")
  ) {
    return true;
  }

  const err = new Error(
    "Email validation fail"
  );

  err.status = 400;

  throw err;
};


exports.passwordValidation = (pass) => {

  if (pass && pass.length >= 8) {
    return true;
  }

  const err = new Error(
    "Password validation fail"
  );

  err.status = 400;

  throw err;
};


exports.currencyValidation = (currency) => {

  if (
    currency === "INR" ||
    currency === "USD" ||
    currency === "EUR"
  ) {
    return true;
  }

  const err = new Error(
    "Currency validation fail"
  );

  err.status = 400;

  throw err;
};


exports.userValidation = async (email) => {

  const user = await model.User.findOne({
    emailId: email,
  });

  return !!user;
};


exports.groupUserValidation = async (
  email,
  groupId
) => {

  const group = await model.Group.findOne(
    {
      _id: groupId,
    },
    {
      groupMembers: 1,
      _id: 0
    }
  );

  const groupMembers = group['groupMembers']
  if (groupMembers.includes(email))
        return true
   else{
        return false
    }
};