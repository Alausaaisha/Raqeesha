const User = require('../models/User');
const sendMail = require('../utils/send_email.js');
const randomPassword = require ('../utils/random_password.js');
const bcrypt = require('bcrypt');

exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    
    try {
      // Check if the user exists with the provided email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Generates a random password
      let newPwd = await randomPassword(7, "alphaNumeric");

      const content = `<p>Hello ${user.name}</p> <br> <p>Your new password is ${newPwd}</p>`
      const salt = await bcrypt.genSalt(10);
      newPwd = await bcrypt.hash(newPwd, salt);

      await sendMail(user.email, "New Password", content);
      await User.findByIdAndUpdate(user._id, { password: newPwd });
      return res.status(200).json({ status: "ok", msg: "A new password has been sent to your mail"})
    
    } catch (error) {
      console.error('Error sending password reset email:', error);
      res.status(500).json({ message: 'Internal server error' });
};

};