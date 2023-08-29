import express, { Request, Response, NextFunction } from 'express';

const trimInputsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Check if the request has a body
    if (req.body) {
      // Loop through all the properties of the body and trim the input values
      for (const key in req.body) {
        if (typeof req.body[key] === "string") {
          req.body[key] = req.body[key].trim();
        }
      }
    }
  
    // Move to the next middleware or route handler
    next();
  };
  
  module.exports = trimInputsMiddleware;