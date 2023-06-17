'use strict';

const client = require('../../db');
const {getToken} = require('./helpers');


const createToken = async user_id =>{
    try {
        const accessToken = await getToken(user_id);
        let SQL = `INSERT INTO JWT (access_token, user_id,datetime_utc) VALUES ($1,$2,$3) RETURNING *;`;
        let safeValues = [accessToken, user_id,new Date(new Date().toUTCString())];
        let {rows} = await client.query(SQL, safeValues);
        return rows[0]
        
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTokenRecord = async (token) =>{
    try {
        let SQL = 'SELECT * FROM JWT WHERE access_token = $1;';
        let safeValue = [token];
        let {rows} = await client.query(SQL,safeValue);
        return rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteToken = async id => {
    try {
        const sql  = `delete from jwt where user_id =$1 returning *`
        let {rows} = await client.query(sql,[id])
        return rows[0]
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    createToken,
    getTokenRecord,
    deleteToken
}