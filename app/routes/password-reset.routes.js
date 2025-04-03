const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/password-reset.controller");



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

  app.post(
    "/password-reset/sendResetLink",
    authJwt.authenticateToken,
    controller.sendResetLink
  );

  app.post(
    "/password-reset/resetPassword/:userId/:token",
    authJwt.authenticateToken,
    controller.resetPassword
  );

};
