'use strict'


// let date = new Date(new Date().toUTCString())
require('dotenv').config();
const {start, server} = require('./src/server')

const client = require('./src/db');

client.connect().then(() => {
    start(process.env.PORT)
}).catch((e) => {
    console.error('CONNECTION_ERROR', e);
})