const express = require('express')
const router = express.Router()
const { 
    insertCustomerCtrl,
    updateCustomerCtrl,
    getCustomersCtrl
} = require('../controllers/customers.v2')

router.post('/customer', insertCustomerCtrl)

router.put('/customer/:uid', updateCustomerCtrl)

router.get('/customers', getCustomersCtrl)

module.exports = router