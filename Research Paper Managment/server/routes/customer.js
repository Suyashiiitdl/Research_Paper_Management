const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')


/**
 *  Customer Routes
 */
router.get('/',customerController.login1)
router.post('/login',customerController.login)
router.get('/signup',customerController.signup1)
router.post('/signup',customerController.signup)
router.get('/Dashboard',customerController.homepage)
// router.get('/view/:id', customerController.view)
router.get('/add',customerController.addCustomer)
// router.post('/add',customerController.postCustomer)
router.get('/view/:id', customerController.view)
router.delete('/edit/:id', customerController.delete)
router.get('/edit/:id', customerController.edit)
router.post('/search', customerController.searchCustomers)
router.get('/about', async (req, res) => {
    res.render('about');
})

module.exports = router