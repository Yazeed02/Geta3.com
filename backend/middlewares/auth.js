const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const User = require('../models/Users');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log('JWT Payload:', jwt_payload); // Debugging the token payload

      // Find user in the database by ID
      const user = await User.findById(jwt_payload.id);

      if (user) {
        console.log('User found:', user); // Log user details
        return done(null, user); // Attach user to req.user
      } else {
        console.error('User not found with provided ID.');
        return done(null, false); // User not found
      }
    } catch (err) {
      console.error('Error in JWT strategy:', err.message);
      return done(err, false); // Internal error
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;