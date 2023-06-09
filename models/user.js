const { Schema, model } = require('mongoose')
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    avatarUrl: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                notebookId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Notebook',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (notebook) {
    let items = [...this.cart.items]
    const index = items.findIndex((b) => {
        return b.notebookId.toString() === notebook._id.toString()
    })

    if (index >= 0) {
        items[index].count = items[index].count + 1
    } else {
        items.push({
            notebookId: notebook._id,
            count: 1
        })
    }
    this.cart = { items }
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const index = items.findIndex(
        (b) => b.notebookId.toString() === id.toString()
    )

    if (items[index].count === 1) {
        items = items.filter((b) => b.notebookId.toString() !== id.toString())
    } else {
        items[index].count--
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.cleanCart = function () {
    this.cart = { itmes: [] }
    return this.save()
}

module.exports = model('User', userSchema)