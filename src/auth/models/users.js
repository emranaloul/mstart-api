const client = require("../../db");
const bcrypt = require('bcrypt');

const addUser = async ({ name, email, phone, gender, dateOfBirth, password, file , role }) => {
    try {
        let hashedPassword = await bcrypt.hash(password.trim(), 10)
        const sql = `INSERT INTO users (name, email, phone, gender, date_Of_Birth, DateTime_UTC, password,image,role ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *;`
        const values = [name.toLowerCase().trim(), email.toLowerCase().trim(), phone.trim(), gender, dateOfBirth, new Date(new Date().toUTCString()), hashedPassword, file,role ?? 'user'];
        let { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}
const updateUser = async ({ name, email, phone, gender, dateOfBirth, date_of_birth, id, status }) => {
    try {
        const sql = `update users set name=$1, email=$2, phone=$3, gender=$4, date_Of_Birth=$5, Update_DateTime_UTC=$6, status=$8 where id = $7 returning *;`
        const values = [name, email, phone, gender, dateOfBirth??date_of_birth, new Date(new Date().toUTCString()), id,status];
        let { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}

const deleteUser = async (id) => {
    try {
        const ids = id.split(',')
        const idCounts = ids.map((s,i)=> `$${i+1}`).join(',')
        const _sql = `delete from jwt where user_id in (${idCounts}) returning *`
        const sql = `delete from users where id in (${idCounts}) returning *;`
        const values = [... ids];
        let { rows: _rows } = await client.query(_sql, values)
        let { rows } = await client.query(sql, values)
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}

const getUsers = async ({ id, limit, offset }) => {
    try {
        let safeValues = [limit ?? 10, offset ?? 0]
        id && safeValues.push(id)
        let sql = `select u.*,j.datetime_utc as last_login from users u left join jwt j on j.user_id = u.id  ${id ? 'where u.id =$3 ' : ''} order by Server_DateTime limit $1 offset $2 `
        let _sql = `select count(*) from users ${id ? 'where id =$1 ' : ''} group by id`
        let { rows } = await client.query(sql, safeValues)
        let { rows:_rows } = await client.query(_sql, safeValues.slice(2))
        rows.forEach(row => delete row.password)
        return {data:rows, count: Number(_rows[0].count)??0 }
    } catch (error) {
        throw new Error(error)
    }
}

const getUser = async (id) => {
    try {
        let sql = `select u.*, j.datetime_utc as last_login from users u left join jwt j on j.user_id = u.id  where u.id=$1`
        let { rows } = await client.query(sql, [id])
        rows[0]?.password &&delete rows[0]?.password
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}

const getUserByEmailOrName = async data => {
    try {
        const sql = `select u.*, j.datetime_utc as last_login from users u left join jwt j on j.user_id = u.id where email =$1 or name=$1`
        const { rows } = await client.query(sql, [data])
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}

const updateImage = async ({image, id}) =>{
    try {
        const sql = `update users set image=$2 where id=$1 returning *`
        const value = [id , image ]
        const {rows} = await client.query(sql,value)
        return rows[0]
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    getUserByEmailOrName,
    updateImage

}