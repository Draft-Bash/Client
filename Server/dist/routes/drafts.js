"use strict";
const draftsRouter = require("express").Router();
const DraftsController = require("../controllers/DraftsController");
draftsRouter.route("/mock")
    .post(DraftsController.createMockDraft);
draftsRouter.route("/members")
    .get(DraftsController.getDraftMembers);
draftsRouter.route("/:id")
    .get(DraftsController.getDraft);
draftsRouter.route("/")
    .get(DraftsController.getUserDrafts);
module.exports = draftsRouter;
