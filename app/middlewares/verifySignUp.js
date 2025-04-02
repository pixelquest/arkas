const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Location = db.location;
const dbRole = db.role;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email?.toLowerCase()
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(409).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

checkDuplicateEmailWileUpdate = (req, res, next) => {
  // Email
  const isEmailInOtherRecords = User.find({
    email: req.body.email?.toLowerCase()
  }).countDocuments().exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (isEmailInOtherRecords > 1) {
      res.status(409).send({ message: "Failed! Email is already in use!" });
      return;
    }
    next();
  });

  // User.findOne({
  //   email: req.body.email?.toLowerCase()
  // }).exec((err, user) => {
  //   if (err) {
  //     res.status(500).send({ message: err });
  //     return;
  //   }

  //   if (user) {
  //     res.status(409).send({ message: "Failed! Email is already in use!" });
  //     return;
  //   }

  //   next();
  // });
};

checkDuplicateLocation = (req, res, next) => {
  // Email
  Location.findOne({
    location: req.body.location?.toLowerCase()
  }).exec((err, location) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (location) {
      res.status(409).send({ message: "Failed! Location is already exist!" });
      return;
    }

    next();
  });
};

checkRolesExisted = (req, res, next) => {
  // console.log(req.body.roles);
  // console.log(typeof req.body.roles, 'type');
  // console.log(typeof JSON.parse(req.body.roles), 'type');
  // console.log(!Array.isArray(req.body.roles), 'type');

  let roles = JSON.parse(req.body.roles);

  // console.log(roles.length, 'roles length');

  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

checkRolesExistedById = (req, res, next) => {
  // console.log(req.body.roles);
  // console.log(typeof req.body.roles, 'type');
  // console.log(typeof JSON.parse(req.body.roles), 'type');
  // console.log(!Array.isArray(req.body.roles), 'type');

  let roles = JSON.parse(req.body.roles);

  // console.log(roles.length, 'roles length');

  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      dbRole.find(
        {
          name: { $in: roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
        }
      );

      // if (!dbRole.includes(roles[i])) {
      //   res.status(400).send({
      //     message: `Failed! Role ${roles[i]} does not exist!`
      //   });
      //   return;
      // }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkDuplicateEmailWileUpdate,
  checkRolesExisted,
  checkRolesExistedById,
  checkDuplicateLocation
};

module.exports = verifySignUp;
