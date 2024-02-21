const router = require("express").Router();
const passport = require("passport");

// auth with google

router.get("/google", (req, res, next) => {
  const { usertype } = req.query;
  if (!usertype) {
    res
      .status(401)
      .json([
        false,
        `userType access required, expected donor or provider, got ${usertype}`,
      ]);
    return;
  }
  req.session.userType = usertype;
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

router.get("/google/redirect", function (req, res, next) {
  passport.authenticate("google", function (err, user, info) {
    if (err) {
      console.log(err);
      return;
    } else if (!user) {
      let error = `there seems to be an error try again please`;
      res.status(400).json([false, error]);
      return;
    } else {
      req.logIn(user, function (err) {
        if (err) {
          return;
        } else {
          req.session.user = req.user;
          res.redirect(
            `https://life-plus-webapp.vercel.app/dashboard?${user._id}`
          );
          return;
        }
      });
    }
  })(req, res, next);
  return;
});

// // auth using facebook
// router.get("/facebook", passport.authenticate("facebook"));

// router.get("/facebook/callback", function (req, res, next) {
//   passport.authenticate("facebook", function (err, user, info) {
//     // copied this implementation from passport docs
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect("/login");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }
//       let success = `welcome back ${req.user.firstname}`;
//       success = JSON.stringify(success);
//       req.flash("success", success);
//       req.session.user = req.user;
//       return res.redirect("/");
//     });
//   })(req, res, next);
// });

module.exports = router;
