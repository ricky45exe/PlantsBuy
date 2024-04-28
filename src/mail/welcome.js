var nodemailer = require("nodemailer");

const welcomemail = async (email) => {
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
    subject: "Welcome to Plants Online-Your Green Heaven Awaits!",
    html: `Dear Customer,
    <br>
    <br>
    We are thrilled to welcome you to Plants Online, where the beauty of nature is just
    click away!🌿
    <br>
    <br>
    As a new member of our community,you've joined a family that celebrates the joy of gardening and the serenity that plants bring to our lives. Whether you're a seasoned plant enthusiast or just beginning your green journey, we've got something special for everyone.
    <br>
    <br>
    Explore our vast collection of lush greenery, vibrant blooms, and unique plant varieties. From low-maintenance succulents to exotic tropical plants, we have carefully curated our selection to cater to every taste and skill level.
    <br>
    <br>
    Stay tuned for exclusive offers, gardening tips, and exciting new arrivals. We're here to make your plant-buying experience delightful and rewarding.
    <br>
    <br>
    Feel free to reach out if you have any questions or need assistance. Happy planting!
    <br>
    <br>
    Coupon Code:new100
    <br>
    Use this Coupon Code to get discount
    <br>
    <br>
    Best Regards,
    <br>
    Plants Online Team`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = welcomemail;
