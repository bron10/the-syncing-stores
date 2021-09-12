'use strict'
const {connectToServer} = require('../services/db.connector')
const {dbConfig : {collection}} = require('config')
//temp

module.exports.up = function (next) {
  connectToServer()
  .then((_db) => {
    _db.createCollection(collection, function(err, res) {
      if (err) throw err;
      console.log("users db created!");
      next()
    });
  })
}

module.exports.down = function (next) {
  next()
}
