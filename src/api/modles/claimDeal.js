const client = require("../../db");
const { updateClaimedDeal } = require("./deals");


const createClaim = async ({user_id, deal_id, amount, currency}) =>{
    try {
        let sql = `insert into claimed_deals (user_id,deal_id,amount,currency, DateTime_UTC) values ($1,$2,$3,$4,$5) returning *`
        const safeValues = [user_id, deal_id, amount, currency,new Date(new Date().toUTCString())]
        const {rows} = await client.query(sql,safeValues)
        await updateClaimedDeal(rows[0].deal_id)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteClaim =  async id =>{
    try {
        const sql = `delete from claimed_deals where id = $1 returning *`
        const safeValues = [id]
        const {rows} = await client.query(sql,safeValues)
        return rows[0]

    } catch (error) {
        throw new Error(error.message)
    }
}

const getClaim = async  id => {
    try {
        const sql =  `select cd.*,d.name as deal_name, u.name as username from claimed_deals cd inner join deals d on d.id=cd.deal_id inner join users u on u.id = cd.user_id  where cd.id = $1 or cd.deal_id =$1`
        const safeValues = [id]
        const {rows} = await client.query(sql,safeValues)
        return rows[0]
    } catch (error) {
        throw new Error(error.message)
    }
}


const getClaims =  async ({limit, offset}) =>{
    try {
        const sql =  `select cd.*,d.name as deal_name, u.name as username from claimed_deals cd inner join deals d on d.id=cd.deal_id inner join users u on u.id = cd.user_id limit $1 offset $2`
        const _sql = `select count(*) from claimed_deals` 
        const safeValues = [limit??10, offset??0]
        const {rows} = await client.query(sql, safeValues)
        const {rows:_rows} = await client.query(_sql)
        return {data:rows, count: Number(_rows[0].count)??0}
    } catch (error) {
        throw new Error(error.message)
    }
}

const getClaimAmountsAndCount = async (id) =>{
    try {
        const sql = `select sum(cd.amount), cd.currency from claimed_deals cd inner join deals d on d.id = cd.deal_id where cd.user_id= $1 group by cd.currency`
        const _sql = `select count(*) from claimed_deals where user_id=$1`
        const {rows} = await client.query(sql,[id])
        const {rows:_rows} = await client.query(_sql,[id])
        return {amounts: rows, count: _rows[0].count}
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    createClaim,
    deleteClaim,
    getClaim,
    getClaims,
    getClaimAmountsAndCount
}