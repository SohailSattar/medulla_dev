var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('./crypto');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
    db.User.findOne({
    where: {
      email: {
        [db.Op.eq]: email
      }
    }
  }).then(async function (user) {
    if(user){
      if (!validPassword(password, user)) {
        return done(null, false, {
          errors: 'Password is incorrect'
        });
      }
      if(!user.active){
        return done(null, false, {
          errors: 'User is inactive'
        });
      }
    }
    else{
      return done(null, false, {
        errors: 'Email not found'
      });
    }
    
    return done(null, user);
  }).catch(function(err){
    done(err);
  });
}));


var validPassword = function (password, user) {
  var hash = crypto.encrypt(password, user.salt);
  return user.hash === hash;
}