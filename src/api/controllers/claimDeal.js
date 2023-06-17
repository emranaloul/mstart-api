const {
    createClaim,
    deleteClaim,
    getClaim,
    getClaims,
    getClaimAmountsAndCount
} = require('../models/claimDeal')

const createClaimHandler = async (req,res) =>{
    try {
        const data = await createClaim({...req.body, user_id: req.user.id})        
        res.send({status: 200, data, message: 'deal claimed successfully'})
    } catch (error) {
        res.send({status: 400, message: error.message})
    }
}

const deleteClaimHandler =  async (req,res) =>{
    try {
        const {id} =  req.params
        const data =  await deleteClaim(id)
        res.send({status: 200, data, message: 'claim deleted successfully'})
    } catch (error) {
        res.send({status: 400, message: error.message})
    }
}

const getClaimHandler = async (req,res) =>{
    try {
        const {id} = req.params
        const data =  await getClaim(id)
        res.send({status: 200, data, message: 'claim retrieved successfully'})
    } catch (error) {
        res.send({status: 400, message: error.message})
    }
}

const getClaimsHandler = async (req,res) =>{
    try {
        const data = await getClaims(req.query)
        res.send({status: 200, data, message: 'claims retrieved successfully'})
    
    } catch (error) {
        res.send({status: 400, message: error.message})
    }
}
 const getClaimAmountsAndCountHandler = async (req,res) =>{
    try {
        const data =  await getClaimAmountsAndCount(req.user.id)
        res.send({status: 200, data, message: 'claims details retrieved successfully'})
    } catch (error) {
        res.send({status: 400, message: error.message})
    }
 }

module.exports ={
    createClaimHandler,
    deleteClaimHandler,
    getClaimHandler,
    getClaimsHandler,
    getClaimAmountsAndCountHandler
}