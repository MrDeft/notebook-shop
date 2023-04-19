const { Router } = require('express')
const router = Router()
const { validationResult } = require('express-validator')
const { notebookValidators } = require('../utils/validators')
const Notebooks = require('../models/notebooks')
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    res.render('add', { title: 'Add page', isAdd: true })
})
router.post('/', auth, notebookValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add page',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                img: req.body.img,
                title: req.body.title,
                price: req.body.price,
                descr: req.body.descr
            }
        })
    }
    const notebook = new Notebooks({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.descr,
        userId: req.user
    })
    try {
        await notebook.save()
        res.redirect('/notebooks')
    } catch (e) {
        console.log(e);
    }
})
module.exports = router;