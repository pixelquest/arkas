const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");


const fileUploader = require('../helpers/file.helper');

const upload = fileUploader('./uploads/');

module.exports = function (app) {
  app.use(function (req, res, next) {
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, Content-Type, Accept"
    // );

    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Allows requests from any origin
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept"); // Specifies allowed request headers
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Specifies allowed HTTP methods

    next();
  });

  const cpUpload = upload.fields([{ name: 'aadharCard', maxCount: 1 }, { name: 'panCard', maxCount: 1 }]);

  app.post(
    "/api/auth/signup",
    [
      cpUpload,
      authJwt.authenticateToken,
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post(
    "/api/auth/signin",
    authJwt.authenticateToken,
    controller.signin
  );

  app.post(
    "/api/auth/sendEmail",
    authJwt.authenticateToken,
    controller.sendEmail
  );

  app.post("/api/auth/signout",
    authJwt.authenticateToken, controller.signout);
};
