const {insert, upsert, findAll} = require('../services/db.connector')
const {appConfig : {defaultErrorCode, responses : {addSuccess, updateSuccess, errorMessage}}} = require('config')
const shortid = require('shortid')
const insertCustomerCtrl = async (req ,res, next) => {
    try{
        const apiUid = shortid.generate();
        const {name, address} = req.body;
        const payload = { name, address, api_uid : apiUid}
        await insert(payload)
        res.send({...payload, message : addSuccess})
    }catch(e){
        console.log("Error", e)
        res.status(defaultErrorCode).send({message : errorMessage})
    }
}

const updateCustomerCtrl = async (req ,res, next) => {
    try{
        const {uid} = req.params;
        const {name, address} = req.body;
        const payload = { name, address, api_uid : uid}
        await upsert({api_uid : uid}, payload)
        res.send({...payload, message : updateSuccess})
    }catch(e){
        res.status(defaultErrorCode).send({message : errorMessage})
    }
}

const getCustomersCtrl = async(req ,res, next) => {
    const customersData = await findAll()
    res.send({customers : customersData})
}

module.exports = {
    insertCustomerCtrl,
    updateCustomerCtrl,
    getCustomersCtrl
}