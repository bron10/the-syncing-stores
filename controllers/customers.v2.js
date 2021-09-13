const {apply, getAll} = require('../services/cache.connector')
const {appConfig : {defaultErrorCode, responses : {addSuccess, updateSuccess, errorMessage}}} = require('config')
const shortid = require('shortid')
const insertCustomerCtrl = async (req ,res, next) => {
    try{
        const apiUid = shortid.generate();
        const {name, address} = req.body;
        const payload = { name, address, api_uid : apiUid}
        await  apply({
            key : apiUid,
            data : JSON.stringify({...payload, api_uid : apiUid}),
            primary : true
        })
        res.send({...payload, message : addSuccess})
    }catch(e){
        console.log("Error", e)
        res.status(defaultErrorCode).send("Error")
    }
}

const updateCustomerCtrl = async (req ,res, next) => {
    try{
        const {uid} = req.params;
        const {name, address} = req.body;
        const payload = { name, address, api_uid : uid}
        await  apply({
            key : uid,
            data : JSON.stringify({...payload, api_uid : uid}),
            primary : true
        })
        res.send({...payload, message : updateSuccess})
    }catch(e){
        res.status(defaultErrorCode).send({message : errorMessage})
    }
}

const getCustomersCtrl = async(req ,res, next) => {
    const customersData = await getAll()
    res.send({customers : customersData.map(data => JSON.parse(data))})
}

module.exports = {
    insertCustomerCtrl,
    updateCustomerCtrl,
    getCustomersCtrl
}