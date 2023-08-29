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
require('dotenv').config();
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
// dshpjsbvgyiwprrd
function sendVerificationEmail(emailAddress, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const CLIENT_ID = process.env.CLIENT_ID;
            const CLIENT_SECRET = process.env.CLIENT_SECRET;
            const REDIRECT_URI = process.env.REDIRECT_URI;
            const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            const confirmEmailUrl = process.env.DOMAIN_NAME + `/api/v1/users/verify?token=${token}`;
            oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
            const accessToken = yield oAuth2Client.getAccessToken();
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'draftbash@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const info = yield transporter.sendMail({
                from: '"Draftbash" <draftbash@gmail.com>',
                to: emailAddress,
                subject: "Email confirmation",
                text: "Confirm your email",
                html: `<a href="${confirmEmailUrl}">Click this link to create your account</a>`,
            });
            console.log("Email sent:", info.response);
        }
        catch (error) {
            console.log(error);
        }
    });
}
module.exports = sendVerificationEmail;
