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
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        proxy: true,
      },
      async function (googleaccessToken, googlerefreshToken, profile, cb) {
        try {
          if (!profile || !profile.emails || profile.emails.length === 0) {
            console.error("Google profile missing email:", profile);
            return cb(new Error("No email found in Google profile"));
          }
          const email = profile.emails[0].value;
          console.log("Google profile received for email:", email);
          // Find or create a user based on the Google profile's id
          let user = await User.findOne({ email: email });

          if (!user) {
            console.log("Creating new user for:", profile.emails[0].value);
            // If the user doesn't exist, return an error
            const hashedpwd = await bcrypt.hash(profile.id, 10);
            const roles = { User: 2001 };

            user = await User.create({
              username: profile.displayName,
              password: hashedpwd,
              email: profile.emails[0].value,
              roles: roles,
            });
            await user.save();
          }
          cb(null, user);
        } catch (error) {
          console.error("Error in Google Strategy verification callback:", error);
          return cb(error);
        }
      }
    )
  );
};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = { initializePassport };
