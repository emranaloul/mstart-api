const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmailOrName, getUser } = require('./users');


async function authenticateBasic(email, password) {
    try {

        let user = await getUserByEmailOrName(email)

        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            return user;
        }
        const error = new Error('Invalid User');
        error.statusCode = 403;
        throw error;
    } catch (error) {
        throw new Error(error.message);
    }
}

let getToken = (userId) => {
    try {
        const expireDate = 900;
        let payload = {
            userId: userId,
        };
        return jwt.sign(payload, process.env.SECRET, { expiresIn: expireDate });
    } catch (error) {
        throw new Error(error.message);
    }
}

let authenticateWithToken = async (token) => {
    try {
        const parsedToken = jwt.verify(token, process.env.SECRET);

        const user = await getUser(parsedToken.userId);
        if (user) return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    authenticateBasic,
    getToken,
    authenticateWithToken
}