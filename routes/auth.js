const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()
const { registerValidators, loginValidators } = require('../utils/validators')
const { body, validationResult } = require('express-validator')

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Auth page',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const { password, email } = req.body
        const condidate = await User.findOne({ email })
        if (condidate) {
            const samPas = bcrypt.compare(password, condidate.password)
            if (samPas) {
                req.session.user = condidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) throw err;

                    res.redirect('/')
                })
            }
        } else {
            req.flash('loginError', 'Password wrong')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e);
        req.flash('loginError', 'This username does not found')
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, password, name, confirm } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPass = await bcrypt.hash(password, 10)
        const user = new User({
            name, email, password: hashPass, cart: { items: [] }
        })
        await user.save()
        res.redirect('/auth/login#login')

    } catch (e) {
        console.log(e);
    }
})

module.exports = router