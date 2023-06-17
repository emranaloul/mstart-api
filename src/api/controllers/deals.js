const {
    addDeal,
    deleteDeal,
    getDeal,
    getDeals,
    updateDeal,
    updateDealStatus
} = require('../models/deals')


const addDealHandler = async (req, res) => {
    try {
        const data = await addDeal(req.body)
        res.send({ status: 200, data, message: 'created successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const deleteDealHandler = async (req, res) => {
    try {
        const { id } = req.params
        try {
            const data = await deleteDeal(id)
            res.send({ status: 200, data, message: 'deleted successfully' })

        } catch (error) {
            const data = updateDealStatus(id, 'deleted')
            res.send({ status: 200, data, message: 'deleted successfully' })
        }
    } catch (error) {
        res.send({ status: 400, message: error.message })

    }
}

const updateDealHandler = async (req, res) => {
    try {
        const data = await updateDeal(req.body)
        res.send({ status: 200, data, message: 'updated successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const getDealHandler = async (req, res) => {
    try {
        const { id } = req.params
        const data = await getDeal(id)
        res.send({ status: 200, data, message: 'get successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const getDealsHandler = async (req, res) => {
    try {
        const data = await getDeals(req.query, req.user.role)
        res.send({ status: 200, data, message: 'get successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

module.exports = {
    addDealHandler,
    getDealHandler,
    getDealsHandler,
    deleteDealHandler,
    updateDealHandler
}