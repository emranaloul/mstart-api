const { deleteRemoteFile } = require('../../uploader')
const {
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    getUserByEmailOrName,
    updateImage
} = require('../models/users')

const addUserHandler = async (req, res) => {
    try {
        let data = await addUser({ ...req.body, file: req.file?.location })
        res.send({ status: 200, data, message: 'registered successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const updateUserHandler = async (req, res) => {
    try {
        const data = await updateUser(req.body)
        res.send({ status: 200, data, message: 'updated successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const deleteUserHandler = async (req, res) => {
    try {
        const { id } = req.params
        const data = await deleteUser(id)
        res.send({ status: 200, data, message: 'deleted successfully' })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const getUserHandler = async (req, res) => {
    try {
        const { id } = req.params
        const data = await getUser(id)
        res.send({ status: 200, data })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const { id } = req.user
        const data = await getUser(id)
        res.send({ status: 200, data })

    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const getUsersHandler = async (req, res) => {
    try {
        const data = await getUsers(req.query)
        res.send({ status: 200, data })
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

const updateImageHandler = async (req, res) => {
    try {
        req.user.image && await deleteRemoteFile(req.user.image)
        const data = await updateImage({image: req.file?.location, id: req.user.id})
        res.send({status: 200, data, message: 'image has been updated successfully'})
    } catch (error) {
        res.send({ status: 400, message: error.message })
    }
}

module.exports = {
    addUserHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserHandler,
    getUsersHandler,
    getMyProfile,
    updateImageHandler
}