const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/password-reset.controller");



module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/passwordReset/sendResetLink",
    authJwt.authenticateToken,
    controller.sendResetLink
  );

  app.post(
    "/passwordReset/resetPassword/:userId/:token",
    authJwt.authenticateToken,
    controller.resetPassword
  );

  app.post(
    "/passwordReset/password",
    authJwt.authenticateToken,
    controller.resetPassword
  );

};
