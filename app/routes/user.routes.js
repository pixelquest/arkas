const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");


const fileUploader = require('../helpers/file.helper');

const upload = fileUploader('./uploads/');
const cpUpload = upload.fields([{ name: 'aadharCard', maxCount: 1 }, { name: 'panCard', maxCount: 1 }]);

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/user/addUser",
    [cpUpload, authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken, verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    controller.addUser
  );

  app.put("/api/user/updateUser/:id",
    [cpUpload, authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken, verifySignUp.checkDuplicateEmailWileUpdate, verifySignUp.checkRolesExistedById],
    controller.updateUser
  );

  app.get("/api/user/allUsers", authJwt.authenticateToken, controller.allUsers);


  app.get("/api/user/searchUser",
    [cpUpload, authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken],
    controller.searchUser
  );


  app.get("/api/user/searchSupervisor",
    [cpUpload, authJwt.verifyToken, authJwt.isAdminOrSupervisor, authJwt.authenticateToken],
    controller.searchSupervisor
  );

  app.delete("/api/user/deleteUser/:id", [authJwt.verifyToken, authJwt.isAdmin, authJwt.authenticateToken], controller.deleteUser);

  // app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isSupervisor],
    controller.supervisorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
