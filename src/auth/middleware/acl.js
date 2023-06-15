const checkAdmin =  (req,res, next) =>{
    try {
        if(req.user.role === 'admin') next()
        else res.send({status: 403, message:'unauthorized'})
    } catch (error) {
        res.send({status: 400, message: error.message   })
    }
}

const checkActive = (req,res,next) =>{
    try {
        if(req.user.status.toLowerCase() === 'active') next()
        else res.send({status: 403, message:'your account is inactive'})
    } catch (error) {
        res.send({status: 400, message: error.message   })
    }
}

module.exports = {
    checkAdmin,
    checkActive
}