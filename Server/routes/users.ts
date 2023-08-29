const usersRouter = require("express").Router();
const UsersController = require("../controllers/UsersController");
// Routes for user

usersRouter.route("/verify")
    .get(UsersController.createVerifiedUser);

usersRouter.route("/create")
    .post(UsersController.createUser);

usersRouter.route("/is-authenticated")
    .get(UsersController.isUserAuthenticated);

usersRouter.route("/unique-username/:username")
    .get(UsersController.isUsernameUnique);

usersRouter.route("/unique-email/:email")
    .get(UsersController.isEmailUnique);

usersRouter.route("/login")
    .post(UsersController.loginUser);

usersRouter.route("/")
    .get(UsersController.getAllUsers)
    .post(UsersController.sendVerificationEmail)
    .put(UsersController.updateUser)
    .delete(UsersController.deleteUser);

usersRouter.route("/:id")
    .get(UsersController.getUser)

module.exports = usersRouter;