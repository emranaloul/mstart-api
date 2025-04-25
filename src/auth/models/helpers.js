const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  getUserByEmailOrName,
  getUser,
  updateLastLogin,
} = require('./usersModel');

async function authenticateBasic(email, password) {
  try {
    let user = await getUserByEmailOrName(email);

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

let getToken = async (userId) => {
  try {
    const expireDate = 3600;
    let payload = {
      userId: userId,
    };
    await updateLastLogin(userId);
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '4weeks' });
  } catch (error) {
    throw new Error(error.message);
  }
};

let authenticateWithToken = async (token) => {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);

    const user = await getUser(parsedToken.userId);
    if (user) return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address');
  }
};
const validateMobileNumber = (number) => {
  const mobileRegex = /^07[7-9]\d{7}$/;
  if (!mobileRegex.test(number)) {
    throw new Error('Invalid mobile number');
  }
};

module.exports = {
  authenticateBasic,
  getToken,
  authenticateWithToken,
  validateMobileNumber,
  validateEmail,
};
