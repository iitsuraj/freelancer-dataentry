var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportConf = require("../config/passport");
var User = require("../models/signup");
var Dataentry = require('../models/dataentry');

router.get("/", passportConf.isAuthenticated, function(req, res, next) {
    res.render("index")
})
router.get("/api",passportConf.isAuthenticated, async function(req, res, next) {
    var data = await Dataentry.find({}).sort({ 'date': -1 }).limit(50).exec()
    res.status(200).send(data);
})
const { Parser } = require('json2csv');
router.post("/filter",passportConf.isAuthenticated, async function(req, res, next) {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    endDate = endDate.setHours(23,59,59,999);
    var data = await Dataentry.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ 'date': -1 }).exec()
      const fields = ['company', 'opb', 'credit', 'debit', 'clb', 'date'];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);
        res.attachment('data.csv');
        res.status(200).send(csv);
})

router.post("/", passportConf.isAuthenticated, function(req, res, next) {
    var data = new Dataentry();
    data.company = req.body.company;
    data.opb = req.body.opb;
    data.debit = req.body.debit;
    data.credit = req.body.credit;
    data.clb = req.body.debit - req.body.credit;
    data.save(function(err, data) {
        if (err) return next(err);
        res.send(data).status(200);
    })
})
router.get('/login', function(req, res, next) {
    res.render("accounts/login", { message: req.flash('message') })
})

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}))

// router.get('/register', function(req, res, next) {
//     res.render("accounts/register")
// })
// router.post('/register', function(req, res, next) {
//     var user = new User();
//     user.email = req.body.email;
//     user.password = req.body.password;
//     User.findOne({ email: req.body.email }, function(_err, existingUser) {
//         if (existingUser) {
//             req.flash("message", "email already exist")
//             res.redirect('/login')

//         } else {
//             user.save(function(err, user) {
//                 if (err) return next(err);
//                 req.logIn(user, function(err) {
//                     if (err) return next(err);
//                     res.redirect('/')
//                 })
//             });
//         }
//     });

// })
router.get("/logout", function(req, res, next) {
    req.logOut();
    res.redirect("/");
});

module.exports = router