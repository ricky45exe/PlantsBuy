const otpGenerator = require("otp-generator");
const order = () => {
  const orderid = otpGenerator.generate(8, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return orderid;
};
module.exports = order;
