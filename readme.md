
## Syncing-stores
This repository contains solution how can we sync two Data-stores. The solution 
is based on events. where each store has a listener that listen to the changes
and sync up the updates to one another.
Two data stores implemented are :
1. MongoDB
2. Redis


The problem took around 5 hours for first prototype completion. The best part of
this application is minimal latency. 

Improvements can be more unit tests cases. 
-------------------------------------------------------

### How to setup.

-  Setup local Redis and MongoDB. Refer `config/default.json` for default setup configuration. 
-  The Redis server by default on local is pretty much auto-started.
- Run following command to start mongoDB on local
`sudo mongod --replSet rs0`
- dont forget to create data store location /data/db
- We need replicaSet functionality activated in mongoDB to use listening feature
of mongoDB.
Ref[https://docs.mongodb.com/v3.6/changeStreams/]

- Start the mongo shell in terminal by command `mongo`. initiate the replica set to default db as shown below
`rs.initiate()`

- Once both data stores are done. Run the following commands

    1. Created migration using `npx migrate create customers`

    2. `npm install` //Install packages

    3. `npm start` //for prod run

    4. Use any client such as postman as shown in demo Runs at `http://localhost:3000/`


#### APIS

1. Create customer
-------------------------------------------------------
`POST: /v1/customer`
`Content-Type : application/json`
`body: {
    "name": "cc Inc",
    "address": "cahce 37", 
}`
-------------------------------------------------------
The above api inserts data in DS store 1. whereas if same api used with `/v2` inserts data to DS store 2. The same logic goes for `PUT`, `GET`.
The other APIS are also shown below with different versions

2. Update customer
-------------------------------------------------------
`PUT: /v2/customer/:uid`
`Content-Type : application/json`
`body: {
    "name": "cc Inc",
    "address": "cahce 37", 
}`
-------------------------------------------------------
Here uid is unique id that is created when we insert customer/user data in above CREATE api.

3. Get all customer
-------------------------------------------------------
`GET: /v1/customers`
-------------------------------------------------------
Get list of all customers.

### DEMO

1. Create a new customer with v1 (DS : mongoDB)
-------------------------------------------------------
![Alt text](newv1.gif?raw=true "Title")

2. Update an existing customer with v2 (DS : redis)
-------------------------------------------------------
![Alt text](updatev2.gif?raw=true "Title")

3. Create a new customer with v2 (DS : redis)
-------------------------------------------------------
![Alt text](newv2.gif?raw=true "Title")

4. Update an existing customer with v1 (DS : mongoDB)
![Alt text](updatev1.gif?raw=true "Title")