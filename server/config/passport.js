// config/passport.js
import passport from "passport";
import passportLocal from "passport-local";
import { query } from "../utils/query.js";
import bcrypt from "bcrypt";
const LocalStrategy = passportLocal.Strategy;

passport.use(
  "local",

  new LocalStrategy(
    {
      usernameField: "loginId",
      passwordField: "password",
    },
    async function (loginId, password, done) {
      try {
        const [user] = await query(
          "SELECT * FROM users WHERE username = $1 OR email = $1 OR phone = $1",
          [loginId]
        );
        console.log("user", user);
        if (!user) {
          return done(null, false, { message: "Incorrect login id." });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(async function (user_id, done) {
  try {
    const [user] = await query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
