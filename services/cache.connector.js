const {cacheConfig : {host, port, prefix}} = require('config')
const redis = require("redis");
const { promisify } = require("util");
const channel = "db-sync"

let _cache

const getCache =  function(key) {
	let data = _cache.getAsync(key)
    try{
        console.log("parsing!")
        data = JSON.parse(data)
    }catch(e){
        console.log("ERror", e)
    }
    return data
}

const apply = function({key, data, primary=true}){
    _cache.set(key, data);
    if(primary){
        _cache.publish(channel, data)
    }
}

const watchCache = function(cb){
    if(_cache){
        return;
    }
    _cache = redis.createClient({
        host, port, prefix
    });
    const subscriber = redis.createClient({
        host, port, prefix
    });
    
    _cache.getAsync = promisify(_cache.get).bind(_cache);
    _cache.setAsync = promisify(_cache.set).bind(_cache);
    _cache.keysAsync = promisify(_cache.keys).bind(_cache);
    _cache.on("error", function(error) {
        console.error("Cache error : ", error);
    })
    
    subscriber.subscribe(channel);
    subscriber.on("message", function(channel, message) {
        console.log("message", message);
        let data = message;
        try{
            data = JSON.parse(message)
        }catch(e){}
        cb(data)
    })
}

const getAll = async () =>{
    const keys = await _cache.keysAsync('customers:*')
    console.log("keys", keys);
    return Promise
    .all(keys.map(key => _cache.getAsync(key.split(':')[1])))
}

module.exports = {
    getCache, apply, watchCache, getAll
};

