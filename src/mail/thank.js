var nodemailer = require("nodemailer");

const thankmail = async (id, email, date) => {
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
    subject: "Thank You for Your Purchase from PlantsBuy",
    html: `Dear Customer,
    <br>
    <br>
    We hope this email finds you well and thriving in the company of nature!
    <br>
    <br>
    We wanted to take a moment to express our heartfelt gratitude for choosing PlantsBuy for your recent plant purchase. Your support means the world to us,and we are thrilled to be a part of your journey to create a green and vibrant space.
    <br>
    <br>
    Here are the details of your order:
    <div>
      <ul>
        <li>Order ID:${id}</li>
        
          <li>Exprected Delivery Date:${date}</li>
        
      </ul>
    </div>
    <br>
    Our team is working diligently to ensure that your plants are carefully packaged and dispatched to reach you on time. If you have any questions or need assistance with your order, please don't hesitate to reach out to us at plants.store.online@gmail.com or call us at 7978098219.
    <br>
    <br>
    Once again,thank you for choosing PlantsBuy. We can't wait for you to experience the joy and beauty that our plants will bring to your home or office.
    <br>
    <br>
    Warm Regards,
    <br>
    PlantsBuy Team`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = thankmail;
