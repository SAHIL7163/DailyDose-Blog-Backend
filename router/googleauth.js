const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
  const { prevUrl } = req.query;
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    state: prevUrl || process.env.FRONTEND_URL,
  })(req, res, next);
});

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    failureMessage: true,

  }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("Authentication failed: req.user is undefined in callback handler");
        return res.status(401).json({
          message: "Unauthorized: Passport failed to populate user",
          query: req.query
        });
      }
      const user = req.user;
      const roles = Object.values(user.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            email: user.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Update user's refreshToken in the database
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as a cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Redirect the user to the frontend
      const redirectUrl =
        (req.query.state || process.env.FRONTEND_URL) + `?token=${accessToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error handling Google callback:", error);
      // Handle errors if needed
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
