var nodemailer = require("nodemailer");

const forgetmail = async (email) => {
  //send email to registered email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "plants.store.online@gmail.com",
      pass: "hcgl bshn rzlv nshd",
    },
  });

  var mailOptions = {
    from: "plants.store.online@gmail.com",
    to: email,
    subject: "Reset Your Plants Buy Password",
    html: `Dear Customer
    <br>
    <br>
    We received a request to  reset your password for your Plants Buy account, and we're here to assist you in regaining access to your plant paradise!
    <br>
    <br>
    To reset your password, please click on the button below.
    <br>
    <br>
    <a href="http://localhost:4500/reset"><input type=button value="Reset Password"  style="background-color:lightgreen;border-radius:12px"></a>
    <br>
    <br>
    This  will redirect you to a secure page where you can input your new password. Please ensure that your new password is strong and unique to protect your account.
    
    <br>
    <br>
    If you did not request this password reset, please disregard this email. Your account security is our top priority, and we encourage you to contact us immediately if you notice any suspicious activity.
    <br>
    <br>
    Thank you for choosing Plants Buy, Your Green Heaven! We hope you continue to enjoy browsing our wide selection of botanical beauties.
    <br>
    <br>
    Happy gardening!
    <br>
    <br>
    Best regards,
    <br>
    Plants Buy Customer Support Team`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = forgetmail;
