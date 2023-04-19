const { Router } = require('express')
const Notebook = require('../models/notebooks')
const router = Router()
const auth = require('../middleware/auth')

function mapCart(cart) {
    return cart.items.map(b => ({
        ...b.notebookId._doc,
        id: b.notebookId.id,
        count: b.count
    }))
}

function computePrice(notebooks) {
    return notebooks.reduce((total, notebook) => {
        return (total += notebook.price * notebook.count)
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    const notebook = await Notebook.findById(req.body.id)
    await req.user.addToCart(notebook)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.notebookId')
    const notebooks = mapCart(user.cart)
    const cart = {
        notebooks,
        price: computePrice(notebooks)
    }
    res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate("cart.items.notebookId")
    const notebooks = mapCart(user.cart)
    res.render('card', {
        title: 'Basked',
        isCard: true,
        notebooks: notebooks,
        price: computePrice(notebooks)
    })
})

module.exports = router