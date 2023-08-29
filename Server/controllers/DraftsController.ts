import { Request, Response } from 'express';
const DraftsModel = require('../models/DraftsModel');
require('dotenv').config();

const createMockDraft = async (req: Request, res: Response) => {
    res.json(await DraftsModel.createMockDraft(req));
}

const getDraft = async (req: Request, res: Response) => {
    res.json(await DraftsModel.getDraft(req));
}

const getAvailablePlayers = async (req: Request, res: Response) => {
    res.json(await DraftsModel.getAvailablePlayers(req));
}

const getUserDrafts = async (req: Request, res: Response) => {
    res.json(await DraftsModel.getUserDrafts(req));
}

const getDraftMembers = async (req: Request, res: Response) => {
    res.json(await DraftsModel.getDraftMembers(req));
}

const selectPick = async (req: Request, res: Response) => {
    res.json(await DraftsModel.selectPick(req));
}

const getPicks = async (req: Request, res: Response) => {
    res.json(await DraftsModel.getPicks(req));
}

module.exports = {
    createMockDraft,
    getDraft,
    getUserDrafts,
    getDraftMembers,
    selectPick,
    getAvailablePlayers,
    getPicks
}