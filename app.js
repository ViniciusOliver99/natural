// Modulos
    const express  = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const path = require('path')
    const user = require('./routes/user')
    const admin = require('./routes/admin')
    const mongoose = require('mongoose')
    const flash = require('connect-flash')  
    const session = require('express-session')
    const passport = require('passport')
    require ('./config/auth')(passport)
    require ('./models/Product')
    const Products = mongoose.model('products')

// Session

        app.use(session ({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use((flash()))

// Handlebars

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

// Body Parser

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Middleware

    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.user = req.user || null
        next()
    })

// Public

    app.use(express.static(path.join(__dirname, 'public')))

// Conecting Monngodb Terminar de conectar

    mongoose.connect('mongodb+srv://goncalves:alinevini@cluster0.qw6f8tu.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('Conectado com Banco de Dados Ecomercer')
    }).catch((err) => {
        console.log('Não foi possivel conectar com o banco de dados ', err)
    })

// Rotas
app.get('/', (req, res) => {

    Products.find({ status: "A" }).lean().sort({name: -1}).then((products) => {
        res.render('layouts/home', {products:products})
    }).catch((err) => {

        console.log('Não foi possível achar os produtos')
    })
})

app.get('/products', (req, res)=> {

    Products.find().lean().sort({date:'desc'}).then((products) => {
        res.render('products/products', {products:products})
    }).catch((err) => {

        console.log('Não foi possível achar os produtos')
    })
})

app.get('/products/:id', (req, res) => {

    Products.findOne({_id: req.params.id}).lean().then((products) => {

        console.log('Achou os dados')
        res.render('products/productsOne', {products:products})
    })
})

app.use('/user', user)
app.use('/admin', admin)

// Porta 

const PORT = process.env.PORT
app.listen(PORT, () => {
    
    console.log('Servidor rodando')
})
