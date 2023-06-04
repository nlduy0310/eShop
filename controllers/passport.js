const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const models = require('../models');

// ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// ham duoc goi boi passport.session de lay thong tin cua user tu csdl va dua vao req.user
passport.deserializeUser(async (id, done) => {
    try {
        let user = await models.User.findOne({
            attributes: ['id', 'email', 'firstName', 'lastName', 'mobile', 'isAdmin'],
            where: { id: id }
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
})

// ham xac thuc nguoi dung khi dang nhap
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // cho phep truyen req vao callback de kiem tra user da dang nhap
}, async (req, email, password, done) => {
    if (email)
        email = email.toLowerCase();

    try {
        if (!req.user) { // user chua dang nhap
            let user = await models.User.findOne({
                where: { email: email }
            });

            if (!user) { // neu email chua ton tai
                return done(null, false, req.flash('loginMessage', 'Email does not exist!'));
            }

            if (!bcrypt.compareSync(password, user.password)) { // neu mat khau khong khop
                return done(null, false, req.flash('loginMessage', 'Invalid password!'));
            }

            // neu tat ca deu dung => cho phep dang nhap
            return done(null, user);
        }
        // neu da dang nhap roi => bo qua
        done(null, req.user);
    } catch (error) {
        done(error);
    }
}))

// ham dang ky tai khoan
passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    if (email)
        email = email.toLowerCase();
    
    if (req.user) { // neu nguoi dung da dang nhap, bo qua
        return done(null, req.user);
    }

    try {
        let user = await models.User.findOne({ where: { email: email } });
        if (user) // neu email da ton tai
            return done(null, false, req.flash('registerMessage', 'Email is already taken!'));
        
        user = await models.User.create({
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile
        })
        
        // thong bao dang ky thanh cong
        done(null, false, req.flash('registerMessage', 'You have registered successfully. Please login!'));
        
    } catch (error) {
        done(error);
    }
}))

module.exports = passport;