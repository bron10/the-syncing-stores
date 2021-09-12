const {insert, connectToServer, getDb} = require('../../services/db.connector');
const {getCache} = require('../../services/cache.connector');
const {dbConfig : {collection}} = require("config")
const shortid = require('shortid');
describe("Test dataStore1", () => {
    beforeAll(function(){
        connectToServer()
    })
    test("test inserting in ds1 should update in ds2", async () => {
        let apiUid = shortid.generate()
        const input = { name: "welcome Inc", address: "Highway 38" , api_uid : apiUid} 
        await insert(collection, { name: "welcome Inc", address: "Highway 38" , api_uid : apiUid})
        const output = await getCache(apiUid);
        expect(input.name).equal(output.name)
        expect(input.address).equal(output.address)
    })
})