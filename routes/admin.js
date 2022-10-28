const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
const Product = mongoose.model('products')
const {IsAdmin} = require('../helpers/IsAdmin')

router.get('/', IsAdmin, (req,res) => {

    res.render('admin/admin')

})

router.get('/add', (req,res) => {

    res.render('admin/add')

})

router.post('/add', (req,res) => {

    var err = [ ]

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err.push({text: 'Nome inválido'})
    }
    if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
       err.push({text: 'Preço inválido'}) 
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        err.push({text: 'Descrição inválida' })
    }

    if(err.length > 0){
        res.render('admin/add', {err:err})
    }else {

            const newProduct = new Product ({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description
            })

            newProduct.save().then(() => {
                req.flash('success_msg','Produto salvo com suceso')
                res.redirect('/admin/add')
            }).catch((err) => {
                console.log('Produto não salvo', err)
            })
        }
    })
    
router.get('/edit', (req, res) => {

    Product.find().lean().then((products) => {

        res.render('admin/edit', {products:products})
    })
})


router.get('/edit/:id', (req, res) => {

    Product.findOne({_id: req.params.id}).lean().then((products) => {

        res.render('admin/editOne', {products:products})
    })
})

router.post('/edit', (req, res) => {

    Product.findOne({_id: req.body.id}).then((products) => {

        products.name = req.body.name
        products.price = req.body.price
        products.description = req.body.description

        products.save().then(() => {

            req.flash('success_msg', 'Produto editado com sucesso')
            res.redirect('/admin/edit')
        })

    }).catch((err) => {

        console.log('Não foi possível achar o produto deste ID', err)
    })
})

router.get('/edit/delet/:id', (req, res) => {

        Product.remove({_id: req.params.id}).then(() => {

            res.redirect('/admin/edit')
        })
})


module.exports = router