const client = require("../../db");

const addDeal = async ({ name, description, amount, currency }) => {
    try {
        const sql = `insert into Deals (name, description, amount,currency, DateTime_UTC) values ($1,$2,$3,$4,$5) returning *`
        const values = [name, description, amount, currency, new Date(new Date().toUTCString())]
        const { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateDeal = async ({ name, description, amount, currency, id, status }) => {
    try {
        const sql = `update deals set name=$2, description=$3, amount=$4, currency=$5, Update_DateTime_UTC=$6, status=$7 where id=$1 returning *`
        const values = [id, name, description, amount, currency, new Date(new Date().toUTCString()), status]
        const { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteDeal = async id => {
    try {
        let sql = `delete from deals where id=$1 returning *`
        const values = [id]
        const { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}

const getDeal = async id => {
    try {
        const sql = `select * from deals where id=$1`
        const values = [id]
        const { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}



const updateDealStatus = async (id, status) => {
    try {
        const sql = `update deals set status=$2 where id= $1 returning *`
        const value = [id, status]
        const { rows } = await client.query(sql, value);
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}


const getDeals = async ({ limit, offset }, role) => {
    try {
        const sql = `select * from deals ${role !== 'admin' ? 'where status not in ($3, $4, $5)' : ''} order by Server_DateTime desc limit $1 offset $2 `
        const _sql = `select count(*) from deals ${role !== 'admin' ? 'where status not in ($1, $2, $3)' : ''}`
        const _values = ['deleted', 'expired', 'inactive']
        let values = [limit ?? 10, offset ?? 0]
        values = role !== 'admin' ? values.concat(_values) : values
        const { rows: rows2 } = await client.query(sql, values)
        const { rows } = await client.query(_sql, role !== 'admin' ? _values : [])
        const { count } = rows[0]
        return { data: rows2, count: Number(count) ?? 0 }

    } catch (error) {
        throw new Error(error.message)

    }
}

module.exports = {
    addDeal,
    deleteDeal,
    getDeal,
    getDeals,
    updateDeal,
    updateDealStatus
}