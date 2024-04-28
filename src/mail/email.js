var nodemailer = require("nodemailer");

const sendmail = async (Name, email, otpv) => {
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
    subject: "One-Time Password for your Plants Online Account",
    html: `Dear Customer,
    <br>
    Welcome to Plants Online. We are thrilled to have you on board.
    <br>
    
    <h4>Your OTP : <b>${otpv}</b></h4>
    
    Please enter this OTP to complete your signup.
    <br>
    <br>
    Thanks for choosing Plants Online. We look forward to serving all your plants related needs.
    <br>
    <br>
    Best Regards,
    <br>
    Team Plants Online`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendmail;
