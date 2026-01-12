const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");
const passport = require("passport");
const bcrypt = require("bcrypt");

const initializePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${(process.env.BACKEND_URL || "http://localhost:8000")}/auth/google/callback`,
        proxy: true,
      },
      async function (googleaccessToken, googlerefreshToken, profile, cb) {
        try {
          if (!profile || !profile.emails || profile.emails.length === 0) {
            return cb(new Error("No email found in Google profile"));
          }
          const email = profile.emails[0].value;
          // Find or create a user based on the Google profile's id
          let user = await User.findOne({ email: email });

          if (!user) {
            const hashedpwd = await bcrypt.hash(profile.id, 10);
            const roles = { User: 2001 };

            user = await User.create({
              username: profile.displayName,
              password: hashedpwd,
              email: profile.emails[0].value,
              roles: roles,
              authProvider: "google",
            });
            await user.save();
          }
          return cb(null, user);
        } catch (error) {
          return cb(error, null);
        }
      }
    )
  );
};

module.exports = { initializePassport };
