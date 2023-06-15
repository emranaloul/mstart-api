const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer()
const  {
    addDealHandler,
    getDealHandler,
    getDealsHandler,
    deleteDealHandler,
    updateDealHandler
} = require('./controllers/deals')
const {
    createClaimHandler,
    deleteClaimHandler,
    getClaimHandler,
    getClaimsHandler,
    getClaimAmountsAndCountHandler
} = require('./controllers/claimDeal')
const bearer = require('../auth/middleware/bearer')
const { checkAdmin } = require('../auth/middleware/acl')

router.get('/deal', bearer ,getDealsHandler)
router.get('/deal/:id', bearer,  getDealHandler)
router.post('/deal', bearer, checkAdmin,upload.none(), addDealHandler)
router.delete('/deal/:id', bearer, checkAdmin, deleteDealHandler)
router.put('/deal', bearer, checkAdmin,upload.none(), updateDealHandler)

router.post('/claim', bearer, upload.none(), createClaimHandler)
router.get('/claim', bearer,checkAdmin,  getClaimsHandler)
router.get('/claim/:id', bearer, getClaimHandler)
router.get('/claimDetailed', bearer, getClaimAmountsAndCountHandler)
router.delete('/claim/:id', bearer,checkAdmin, deleteClaimHandler)

module.exports= router