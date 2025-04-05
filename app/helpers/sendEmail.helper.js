const nodemailer = require("nodemailer");

const sendEmailHelper = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            // service: process.env.SERVICE,
            // port: 587,
            // secure: true,
            // auth: {
            //     // user: process.env.USER,
            //     // pass: process.env.PASS,
            //     user: "lavanyachiluveri1991@gmail.com",
            //     pass: "Lucky$1491#",
            // },

            service: "gmail", // Example for using Gmail
            auth: {
                user: "lavanyachiluveri1991@gmail.com",
                pass: "Lucky$1491#",
            },

        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent sucessfully");
    } catch (error) {
        console.log(error, "Email not sent");
    }
};

module.exports = sendEmailHelper;