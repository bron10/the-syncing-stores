const {MongoClient} = require('mongodb');
const {dbConfig : {protocol, host, port, dbName, collection}} = require('config')

let _db
const connectToServer = async function() {
	if(_db){
		return _db;
	}
	_db = await MongoClient.connect(`${protocol}://${host}:${port}/${dbName}`);
	return _db.db(dbName);
}

const getDb =  function() {
	return _db.db(dbName)
}

const insert = async function(dataSet){
	const inserted = await _db.db(dbName).collection(collection).insertOne(dataSet);
	return dataSet;
}

const watchDB = async (cb) => {
	const dbName = await connectToServer()
	const collect = dbName.collection(collection)
	let changeStreams = collect.watch()
	changeStreams.on('change', async function(data){
		let dataSet = {}
		const {fullDocument, updateDescription, documentKey} = data;
		if(fullDocument){
			const {fullDocument : {_id, ...addedData}}= data
			dataSet = addedData;
		}
		if(updateDescription){
			const {_id, ...found} = await collect.findOne({_id : documentKey._id})
			dataSet = found;
		}
		
		cb(dataSet)	
	});
}

const upsert = async (query, values) => {

	const setData = {$set : values}
	const upserted = _db.db(dbName).collection(collection).updateOne(query, setData, {upsert:true})
	return upserted
}

const findAll = async (query={}) => {
	return await _db.db(dbName).collection(collection).find(query, {projection:{ _id: 0 }}).toArray()
}

module.exports = {
	getDb, findAll,
	insert, watchDB, upsert
};