const draftsRouter = require("express").Router();
const DraftsController = require("../controllers/DraftsController");

draftsRouter.route("/mock")
    .post(DraftsController.createMockDraft)

draftsRouter.route("/members")
    .get(DraftsController.getDraftMembers)

draftsRouter.route("/players")
    .get(DraftsController.getAvailablePlayers)

draftsRouter.route("/picks")
    .post(DraftsController.selectPick)
    .get(DraftsController.getPicks)

draftsRouter.route("/:id")
    .get(DraftsController.getDraft)

draftsRouter.route("/")
    .get(DraftsController.getUserDrafts)

module.exports = draftsRouter;