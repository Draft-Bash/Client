"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const getAllUsers = (req, res) => {
    res.json("hello");
};
const isUserAuthenticated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield UsersModel.isUserAuthenticated(req));
});
const isUsernameUnique = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ unique: yield UsersModel.isUsernameUnique(req) });
});
const isEmailUnique = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ unique: yield UsersModel.isEmailUnique(req) });
});
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(UsersModel);
    res.json(yield UsersModel.sendVerificationEmail(req));
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield UsersModel.login(req));
});
const updateUser = (req, res) => {
    res.json();
};
const deleteUser = (req, res) => {
    res.json();
};
const getUser = (req, res) => {
    res.json("Hi");
};
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield UsersModel.createUser(req);
});
const createVerifiedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = jwt.verify(req.query.token, process.env.JWT_SECRET);
        UsersModel.createVerifiedUser(user.user_name, user.user_email, user.password);
        res.render('confirmEmail.ejs');
    }
    catch (error) {
        if (error.name == 'TokenExpiredError') {
            res.render('confirmationTokenExpired.ejs');
        }
        else {
            res.render('confirmationTokenInvalid.ejs');
        }
    }
});
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
};
