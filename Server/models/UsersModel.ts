import { Request, Response } from 'express';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../db");
const sendVerificationEmail = require("../utils/nodeMailer/sendVerificationEmail");

class UsersModel {

    public async sendVerificationEmail(req: Request) {
        const { user_name, user_email, password} = req.body;

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);
        const user = {
            user_name: user_name,
            user_email: user_email,
            password: bcryptPassword
        }

        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "12hr"});
        sendVerificationEmail(user_email, token);
    }

    public async isUserAuthenticated(req: Request) {
        const jwtToken = req.header("token");
        try {
            const user = jwt.verify(jwtToken, process.env.JWT_SECRET, {expiresIn: "2hr"});
            return user;
        } catch (error) {
            return false;
        }
    }

    public async isEmailUnique(req: Request) {
        const { email } = req.params;
        try {
            console.log(email);
            const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
            if (user.rows.length == 0) {
              return true;
            } else {
              return false;
            }
          } catch (error) {
            console.error(error);
          }
    }

    public async isUsernameUnique(req: Request) {
        const { username } = req.params;
        try {
            const user = await db.query('SELECT * FROM users WHERE user_name = $1', [username]);
            console.log(user.rows);
            if (user.rows.length == 0) {
              return true;
            } else {
              return false;
            }
          } catch (error) {
            console.error(error);
          }
    }

    public async login(req: Request) {
        try {
            const { user_name, user_email, password} = req.body;
            const user = await db.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2;", [
                user_name, user_email
            ]);
            const userData = {user_id: user.rows[0].user_id, user_name: user.rows[0].user_name}
            const validPassword = await bcrypt.compare(password, user.rows[0].password);

            if (validPassword) {
                const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: "2hr"});
                return token;
            }

        } catch (error) {
            
        }
    }

    public async createUser(req: Request) {

      const user = req.body;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const bcryptPassword = await bcrypt.hash(user.password, salt);

      const duplicateRows = await db.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2", [
        user.user_name, user.user_email
      ]);

      if (duplicateRows.rows.length < 1) {
          await db.query("INSERT INTO users (user_name, user_email, password) VALUES ($1, $2, $3)", [
          user.user_name, user.user_email, bcryptPassword
      ]);
      }
    }

    public async createVerifiedUser(user_name: string, user_email: string, password: string) {
        const duplicateRows = await db.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2", [
            user_name, user_email
        ]);

        if (duplicateRows.rows.length < 1) {
            await db.query("INSERT INTO users (user_name, user_email, password) VALUES ($1, $2, $3)", [
            user_name, user_email, password
        ]);
        }
    }
}
  
  module.exports = new UsersModel();