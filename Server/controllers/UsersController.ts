import { Request, Response } from 'express';
const UsersModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAllUsers = (req: Request, res: Response) => {

    res.json("hello");
}

const isUserAuthenticated = async (req: Request, res: Response) => {
    res.json(await UsersModel.isUserAuthenticated(req));
}


const isUsernameUnique = async (req: Request, res: Response) => {
    res.json({ unique: await UsersModel.isUsernameUnique(req)});
}

const isEmailUnique = async (req: Request, res: Response) => {
    res.json({ unique: await UsersModel.isEmailUnique(req)});
}

const sendVerificationEmail = async (req: Request, res: Response) => {
    //console.log(UsersModel);
    res.json(await UsersModel.sendVerificationEmail(req));
}

const loginUser = async (req: Request, res: Response) => {
    res.json(await UsersModel.login(req));
}

const updateUser = (req: Request, res: Response) => {
    res.json()
}

const deleteUser = (req: Request, res: Response) => {
    res.json()
}

const getUser = (req: Request, res: Response) => {
    res.json("Hi");
}

const createUser = async (req: Request, res: Response) => {
    await UsersModel.createUser(req);
}


const createVerifiedUser = async (req: Request, res: Response) => {
    try {
        const user = jwt.verify(req.query.token as string, process.env.JWT_SECRET);
        UsersModel.createVerifiedUser(user.user_name, user.user_email, user.password);

        res.render('confirmEmail.ejs');
    } catch (error: any) {
        if (error.name == 'TokenExpiredError') {
            res.render('confirmationTokenExpired.ejs');
        }
        else {
            res.render('confirmationTokenInvalid.ejs');
        }
    }
}

module.exports = {
    getAllUsers,
    sendVerificationEmail,
    updateUser,
    deleteUser,
    getUser,
    createVerifiedUser,
    loginUser,
    isUsernameUnique,
    isEmailUnique,
    isUserAuthenticated,
    createUser
}