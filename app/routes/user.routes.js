const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user",
    [authJwt.verifyToken, authJwt.isUserOrNot],
    controller.userBoard);
  app.get("/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard);
  app.get("/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard);
  app.put("/api/test/update/:id", [authJwt.verifyToken], controller.update);
  app.get("/api/test/find/:id", [authJwt.verifyToken], controller.findAllRole);
  app.get("/api/test/contain", [authJwt.verifyToken], controller.findContain);
  app.delete("/api/test/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.destroy);
};