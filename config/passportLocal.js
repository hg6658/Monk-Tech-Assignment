var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../model/user');
const bcrypt = require('bcryptjs');
var strategy = new LocalStrategy({ 
    usernameField: 'email',    
    passwordField: 'password'
  },
    async function verify(email, password,cb){
    try{
        let user = await User.findOne({emailID:email},{});
        if(!user){
            return cb(null,false,{message: ''});
        }
        let result = await bcrypt.compare(password, user.password);
        
        if(result){
            return cb(null,user);
        }else{
            return cb(null,false,{message: ''});
        }
    }catch(err){
        return cb(err);
    }    
})

passport.use(strategy);

passport.serializeUser(function(user, cb) {
      return cb(null, {
        email: user.emailID,
        userName: user.name,
        isAdmin: user.isAdmin
      });
  });
  
passport.deserializeUser(async function(user, cb) {

    try{
        let userNew = await User.findOne({emailID: user.email});
        if(!userNew){
            return cb(null,false,{message: 'User cannot be found'});
        }
        return cb(null,userNew);
    }catch (err){
        return cb(err);
    }
  });
  

module.exports = passport;