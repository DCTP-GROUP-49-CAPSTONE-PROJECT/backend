const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
// const FacebookStratategy = require("passport-facebook");
const User = require("../models/user");
const Provider = require("../models/provider");

// serialize and desirialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  if (await User.findById(id)) {
    User.findById(id).then((user) => {
      done(null, user);
    });
  } else {
    Provider.findById(id).then((user) => {
      done(null, user);
    });
  }
});

// connecting to the google strategy method to auth user
passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // checking if google user profile exists in db
      const userFromDb = await User.findOne({ email: profile.emails[0].value });
      const providerFromDb = await Provider.findOne({
        email: profile.emails[0].value,
      });
      if (userFromDb) {
        done(null, userFromDb);
        return;
      } else if (providerFromDb) {
        done(null, providerFromDb);
        return;
      } else {
        // save profile to db if user does not exist in db
        try {
          const userType = req.session.userType;

          if (userType === "donor") {
            const user = new User({
              fullName: `${profile.name.familyName} ${profile.name.givenName}`,
              email: profile.emails[0].value,
              thumbnail: profile._json.picture,
              googleId: profile.id,
            });
            if (await user.save()) {
              done(null, user);
            }
            return;
          } else if (userType === "provider") {
            const provider = new Provider({
              facilityName: `${profile.name.familyName} ${profile.name.givenName}`,
              email: profile.emails[0].value,
              thumbnail: profile._json.picture,
              googleId: profile.id,
            });

            if (await provider.save()) {
              done(null, provider);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  )
);

// implementing facebook auth strategy to auth user

// passport.use(
//   new FacebookStratategy(
//     // options for the strategy
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["email", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // destructure user details from json
//       const { email, first_name, last_name, id } = profile._json;
//       // checking if facebook user profile exists in db
//       const userFromDb = await User.findOne({ facebookId: id });
//       if (userFromDb) {
//         done(null, userFromDb);
//       } else {
//         // save profile to db if user does not exist
//         try {
//           const user = new User({
//             firstname: first_name,
//             lastname: last_name,
//             email: email,
//             facebookId: id,
//           });
//           // save user
//           if (await user.save()) {
//             done(null, user);
//           }
//         } catch (error) {
//           console.log(error.message);
//         }
//       }
//     }
//   )
// );
