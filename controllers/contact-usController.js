const ContactUs = require('../models/contact-us'); // Import the ContactUs model
const sendMail = require('../utils/send_email'); // Import the sendMail function

exports.contactUs = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Create a new ContactUs instance
        let contact = new ContactUs({ name, email, message });

        // Prepare the email content
        const content = `<p>From ${name}</p><br><p>Customer's email: ${email}</p><br>Message: ${message}`;

        // Send email to the specified recipient
        await sendMail("raqeesha.ao@gmail.com", "Customer Request", content);

        // Save the contact details to the database
        await contact.save();

        // Respond with a success message
        return res.status(200).json({
            status: "success",
            message: "Thank you for reaching out to Raqeesha. Your message will be attended to in due time."
        });
    } catch (error) {
        console.error(error);
        // Respond with an error message
        return res.status(500).json({
            status: "error",
            message: "An error occurred. Please try again later."
        });
    }
};
