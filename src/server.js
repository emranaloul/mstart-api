const express = require('express');
const app = express();
const multer = require('multer');
const upload =  multer()
const bearer = require('./auth/middleware/bearer')
const basic = require('./auth/middleware/basic')
const cors = require('cors');
const {
    addUserHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserHandler,
    getUsersHandler,
    getMyProfile,
    updateImageHandler
} = require('./auth/controllers/users');
const { uploadS3 } = require('./uploader');
const { checkAdmin, checkActive } = require('./auth/middleware/acl');
const router = require('./api/router');
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/api', router)
app.post('/auth/signup', uploadS3.single('avatar'), addUserHandler)
app.post('/auth/signin', basic, checkActive, (req, res) => {
    res.send({message:'logged in successfully', user: req.user, token:req.tokens, status: 200})
})
app.put('/user', bearer, upload.none(), updateUserHandler)
app.post('/avatar', bearer,uploadS3.single('avatar'), updateImageHandler)
app.delete('/user/:id', bearer, upload.none(), deleteUserHandler)
app.get('/user/:id', bearer, upload.none(), getUserHandler)
app.get('/user', bearer, checkAdmin , getUsersHandler)
app.get('/me', bearer, getMyProfile)


module.exports = {
    server: app, 
    start: (port) => {
        const PORT = port ?? 3000
        app.listen(PORT, () => {
            console.log(`Server up on port ${port}`)
        });
    },
}