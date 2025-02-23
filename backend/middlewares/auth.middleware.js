// Dependencies
const jwt = require("jsonwebtoken");

// Database models
const user_model = require("../models/user.model.js");

// Signup request body verification
const verifySignUpBody = async (req, res, next) => {
  try {
    if (!req.body.name || req.body.name.length < 3 || req.body.name.length > 50) {
      return res.status(401).send({
        error: "Name size should be 3 to 50 characters",
      });
    }
    if (!req.body.username || req.body.username.length < 3 || req.body.username.length > 20) {
      return res.status(401).send({
        error: "Username size should be 3 to 20 characters",
      });
    }
    if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 16) {
      return res.status(401).send({
        error: "Password size should be 8 to 16 characters",
      });
    }

    const user = await user_model.findOne({ username: req.body.username });
    if (user) {
      return res.status(401).send({
        error: "Username already in use. Try a different Username",
      });
    }
    next();
  } catch (err) {
    logger.error("AUTH | SignUp Request body validation failed: ", err);
    return res.status(501).send({
      error: "SignUp Request body validation failed",
    });
  }
};

// Signin request body verification
const verifySignInBody = (req, res, next) => {
  try {
    if (!req.body.username || req.body.username.length < 3 || req.body.username.length > 20) {
      return res.status(401).send({
        error: "Username size should be 3 to 20 characters",
      });
    }
    if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 16) {
      return res.status(401).send({
        error: "Password size should be 8 to 16 characters",
      });
    }
    next();
  } catch (err) {
    logger.error("AUTH | SignIn Request body validation failed: ", err);
    return res.status(501).send({
      error: "SignIn Request body validation failed",
    });
  }
};

// Token verification
const validateToken = (req, res, next) => {
  if (req.cookies?.token) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          error: "Unauthorized, Invalid Token",
        });
      }
      try {
        const user = await user_model.findById(decoded.id);
        if (!user) {
          return res.status(401).send({
            error: "Unauthorized, the user for this token does not exist",
          });
        }
        req.user = user;
        next();
      } catch (error) {
        logger.error("AUTH | Error while searching for user in database: ", error);
        return res.status(501).send({
          error: "Token validation failed",
        });
      }
    });
  } else {
    return res.status(401).send({ error: "You are not logged in !" });
  }
};

module.exports = {
  verifySignUpbody: verifySignUpBody,
  verifySignInBody: verifySignInBody,
  validateToken: validateToken,
};
