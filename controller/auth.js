const express = require('express')
const router = express.Router()
const passport = require('passport');
const User = require('../model/user');
router.get('/login', (req, res) => {
    res.render('index', {partial: 'login'});
});

router.post('/save-user',async (req,res)=>{

    try{
        const { name, email, password } = req.body;
        const newUser = new User({ 'name':name, 'emailID':email,'password': password });
        await newUser.save()
        res.redirect('/auth/login');
    }catch(err){
        res.redirect('/auth/register');
    };
});

router.post('/login-attempt',passport.authenticate('local'),(req,res)=>{
    res.redirect('/dashboard');
})
  
router.get('/register', (req, res) => {
    res.render('index', {partial: 'register'});
});

router.get('/logout', (req,res) =>{
    req.logout(() => {
        res.redirect('/auth');
    });
})

module.exports = router