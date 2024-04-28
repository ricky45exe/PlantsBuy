const otpGenerator = require("otp-generator");
const generateOTP = () => {
  const OTP = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return OTP;
};
module.exports = generateOTP;
