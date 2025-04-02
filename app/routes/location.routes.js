const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/location.controller");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/location/allLocations", [authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken], controller.allLocations);

    app.post("/api/location/addLocation", [authJwt.verifyToken, authJwt.isAdmin, authJwt.authenticateToken], controller.addLocation);

    app.put("/api/location/updateLocation/:id", [authJwt.verifyToken, authJwt.isAdmin, authJwt.authenticateToken], controller.updateLocation);

    app.delete("/api/location/deleteLocation/:id", [authJwt.verifyToken, authJwt.isAdmin, authJwt.authenticateToken], controller.deleteLocation);


    //app.get("/api/role/allRoles", [authJwt.verifyToken, authJwt.isAdmin], controller.allRoles);
};
