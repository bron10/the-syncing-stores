const express = require('express')
const {appConfig : {port}} = require('config')
const app = express()
const {json : jsonParser} = require('body-parser')
const v1Routes = require('./routes/v1')
const v2Routes = require('./routes/v2')
const {watchDB, upsert} = require('./services/db.connector')
const {watchCache, apply} = require('./services/cache.connector')

app.use(jsonParser())
app.use('/v1', v1Routes)
app.use('/v2', v2Routes)
app.listen(port, ()=> {
    
    watchDB(function({api_uid, ...dataSet}){
        apply({
            key : api_uid,
            data : JSON.stringify({...dataSet, api_uid}),
        })
    })

    watchCache(function(data){
        upsert({api_uid : data.api_uid}, data)
    })
})