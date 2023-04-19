const { Router } = require('express');
const Notebooks = require('../models/notebooks');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const notebooks = await Notebooks.find().populate('userId', 'email name')
        res.render('notebooks', { title: 'Notebooks', isNotebooks: true, userId: req.user ? req.user._id.toString() : null, notebooks })
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const notebook = await Notebooks.findById(req.params.id)
        if(notebook.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/notebooks')
        }
        res.render('notebook-edit', {
            title: `Edit ${notebook.title}`,
            notebook
        })
    } catch(e) {
        console.log(e);
    }
})

router.post('/edit', auth, async (req, res) => {
    await Notebooks.findOneAndUpdate(req.body.id, req.body);
    res.redirect('/notebooks')
})

router.get('/:id', async (req, res) => {
    const notebook = await Notebooks.findById(req.params.id)
    res.render('notebook', {
        title: `Notebook ${notebook.title}`,
        layout: 'detail',
        notebook
    })
})
router.post('/remove', async (req, res) => {
    try {
        res.redirect('/notebooks')
        await Notebooks.deleteOne({ _id: req.body.id })
    } catch (e) {
        console.log(e);
    }
})

module.exports = router