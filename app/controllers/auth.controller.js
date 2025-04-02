const config = require("../config/auth.config");

const db = require("../models");
const nodemailer = require('nodemailer');

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = async (req, res) => {
  const aadharCard = req.files['aadharCard'] ? req.files['aadharCard'][0] : null;
  const panCard = req.files['panCard'] ? req.files['panCard'][0] : null;

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    reference: req.body.reference,
    aadharCard: aadharCard.path,
    panCard: panCard.path,
    phone: req.body.phone,
    email: req.body.email.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // console.log(req.body, 'user');
  User.find({}).sort({ rowNumber: -1 }).limit(1).then((data) => {
    if (data) {
      let n = (data[0]?.rowNumber) ? (data[0].rowNumber + 1) : 1984;
      let empId = 'ARKAS' + n;
      user.empId = empId;
      user.rowNumber = n;

      user.save((err, user) => {
        // console.log(req.body.roles);
        // console.log(typeof req.body.roles, 'type');
        // console.log(typeof JSON.parse(req.body.roles), 'type');
        // console.log(!Array.isArray(req.body.roles), 'type');
        let uRoles = JSON.parse(req.body.roles);
        // console.log(roles.length, 'roles length');
        // console.log(uRoles, 'Assigned ROles');


        if (err) {
          // console.log(err, 'err');
          res.status(500).send({ message: err });
          return;
        }

        if (!Array.isArray(uRoles)) {
          return res.status(400).send({ error: 'Roles should be an array' });
        }

        if (uRoles) {
          Role.find(
            {
              name: { $in: uRoles },
            },
            (err, roles) => {
              if (err) {
                // console.log(err, 'err');
                res.status(500).send({ message: err });
                return;
              }
              // console.log(roles, 'Roles');
              user.roles = roles.map((role) => role._id);
              // console.log(user, 'User Roles');

              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }

                res.send({ message: "User was registered successfully!" });
              });
            }
          );
        } else {
          Role.findOne({ name: "User" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ message: "User was registered successfully!" });
            });
          });
        }
      })
    }
  })
}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email?.toLowerCase(),
    deleteStatus: false
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toUpperCase());
      }

      req.session.token = token; // store the token in the session

      res.status(200).send({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        reference: user.reference,
        email: user.email,
        roles: authorities,
      });
    });
};

exports.sendEmail = async (req, res) => {
  const { name, email, message, phone } = req.body; // Extract email details from request

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail for simplicity
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password',  // Replace with your email password
    },
  });

  let htmlMessage = `<p>Hi  ${name?.toUpperCase()},</p><br>
  <p>Thanks for contacting us. We will get back to you soon with your query.</p>
  <hr><br><br>
  <p>Details:</p>
  <p>Name: ${name}</p>
  <p>Email: ${email}</p>
  <p>Phone: ${phone}</p>
  <p>Message: ${message}</p>`;

  // Email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    cc: email, // Sender email
    to: "praveengandhe@gmail.com", // Recipient email
    subject: "ARKAS - Contact/Feedback Form Request", // Email subject
    html: htmlMessage // Email content
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
};


exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
