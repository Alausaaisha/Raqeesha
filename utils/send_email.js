const nodemailer = require('nodemailer');


const sendMail = async (recipient, title, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "qtaisha.ao@gmail.com",
      pass: "mxrhjsbxnghpwtaw",
    }
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      const message = {
        from: "qtaisha.ao@gmail.com",
        to: recipient,
        subject: title,
        html: content,
      };
      transporter.sendMail(message, () => {
        console.log("email sent");
      });
    }
  });
}

module.exports = sendMail;
