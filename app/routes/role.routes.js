const { authJwt } = require("../middlewares");
const controller = require("../controllers/role.controller");
const config = require("../config/auth.config");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.secret;

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/role/allRoles", authJwt.authenticateToken, controller.allRoles);

    // app.get("/role/allRoles", [authJwt.verifyToken, authJwt.isAdmin], controller.allRoles);
};
