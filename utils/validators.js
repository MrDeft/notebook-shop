const { body } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
exports.registerValidators = [
    body('email').isEmail().withMessage('Enter your email currently').custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value })
            if (user) {
                return Promise.reject('This email is already exits')
            }
        } catch (e) {
            console.log(e);
        }
    }).normalizeEmail(),
    body('password', 'Password should be min 6 symbols').isLength({ min: 6, max: 56 }).isAlphanumeric().trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password should be similar')
        }
        return true
    }).trim(),
    body('name').isLength({ min: 3 }).withMessage('Name should be min 3 symbols').trim()
]

exports.notebookValidators = [
    body('title').isLength({ min: 3 }).withMessage('Title should be min 3 symbols').trim(),
    body('price').isNumeric().withMessage('Write correct price'),
    body('descr').isLength({ min: 10 }).withMessage('Description should be min 10 symbols'),
    body('img').isURL().withMessage('Write correnct URL Image')
]



exports.loginValidators = [
    body('email').isEmail().withMessage('Enter your email currently').custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value })
            if (user) {
                // const samPas = bcrypt.compare(req.body.password, user.password)
                // if (req.body.password === user.password) {
                //     console.log('yessss');
                // } else {
                //     console.log('qateee');
                // }

                return Promise.reject('This email is already exits')
            }
        } catch (e) {
            console.log(e);
        }
    }).normalizeEmail(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password should be similar')
        }
        return true
    }).trim()
]