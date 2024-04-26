const express = require('express');
const router = express.Router();
const employee = require('./employee');
const admin = require('./admin');

router.get('/', isLoggedIn);
router.use('/admin', isAdmin, admin);
router.use('/employee', isEmployee, employee);

function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin === true) {
        return next();
    }
    return res.redirect('/login');
}

function isEmployee(req, res, next) {
    if (req.user && req.user.isAdmin === false) {
        return next();
    }
    return res.redirect('/login');
}

function isLoggedIn(req, res) {
    if (req.user && req.user.isAdmin === true) {
        return res.redirect("/dashboard/admin");
    } else if (req.user) {
        return res.redirect("/dashboard/employee");
    } else {
        return res.redirect("/auth/login");
    }
}

module.exports = router;
