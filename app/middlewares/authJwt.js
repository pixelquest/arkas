const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const SECRET_KEY = config.secret;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  console.log(token, 'token')

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find({
      _id: { $in: user.roles },
    },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "Admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isSupervisor = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "Supervisor") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Supervisor Role!" });
        return;
      }
    );
  });
};

isAdminOrSupervisor = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // console.log(user, 'user');
    // let uRoles = JSON.parse(user.roles);

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "Supervisor" || roles[i].name === "Admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin/Supervisor Role!" });
        return;
      }
    );
  });
};

authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  //arkas-pg-key
  const token = authHeader && authHeader.split(' ')[1];  // Bearer eyJhbGciOiJIUzI1NiJ9.e30.9jwxOzpauX97ruCGbQktsbyq_EfWUMF3lDhYPop38cQ 
  // console.log(token, 'token')
  if (token == null) return res.sendStatus(401);  // No token present

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);  // Invalid token

    req.user = user;
    next();
    return;
  });
};


const authJwt = {
  verifyToken,
  isAdmin,
  isSupervisor,
  isAdminOrSupervisor,
  authenticateToken
};
module.exports = authJwt;
