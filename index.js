const express = require('express')
const app = express()
const session = require('express-session')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const notebooksRoutes = require('./routes/notebooks')
const cardRoutes = require('./routes/card')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const User = require('./models/user')
const flash = require('connect-flash')
const MongoStore = require('connect-mongodb-session')(session)
const { default: mongoose } = require('mongoose')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const wareMiddleware = require('./middleware/ware')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')
const errorPage = require('./routes/404')
const path = require('path')


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'session',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(session({
    secret: 'secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(fileMiddleware.single('avatar'))
app.use(wareMiddleware)
app.use(userMiddleware)

app.use(flash())
app.use(express.static(__dirname + "/public/"));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/notebooks', notebooksRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorPage)

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'bouirjan@gmail.com',
        //         name: 'Bouirjan',
        //         cart: { items: [] }
        //     })
        //     user.save()
        // }
        app.listen(5000, () => console.log(`Server started...`))
    } catch (e) {
        console.log(e);
    }
}
start()
