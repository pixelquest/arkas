const { authJwt } = require("../middlewares");
const controller = require("../controllers/bank.controller");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/bank/saveUserBank", [authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken], controller.saveUserBank);
};
