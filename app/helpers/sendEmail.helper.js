const nodemailer = require("nodemailer");

const sendEmailHelper = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Google's SMTP server
            port: 465, // Port for SSL (secure)
            secure: true, // Use SSL
            auth: {
                user: "arkasfacilities@gmail.com",
                pass: "mout xvjo gygc qzfp",
            },
        });

        const info = await transporter.sendMail({
            to: email,
            subject: subject,
            html: text,
        });
        // console.log(info);
        return info; // Return info for further processing, if needed
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw error to handle it where the function is called
    }
};

module.exports = sendEmailHelper;

// const nodemailer = require('nodemailer');

// // Helper function to send emails
// const sendEmail = async ({ from, to, subject, text, attachments }) => {
//     try {
//         console.log('process.env.EMAIL_USER', process.env.EMAIL_USER);

//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com', // Google's SMTP server
//             port: 465, // Port for SSL (secure)
//             secure: true, // Use SSL
//             auth: {
//                 user: process.env.EMAIL_USER, // Use environment variables for security
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         const mailOptions = { from, to, subject, text, attachments };

//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', info.response);

//         return info; // Return info for further processing, if needed
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error; // Re-throw error to handle it where the function is called
//     }
// };

// module.exports = sendEmail;