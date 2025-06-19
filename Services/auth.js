const jwt = require('jsonwebtoken');

// Use environment variable or fallback to default (not recommended for production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    }, JWT_SECRET);
}

function getUser(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};
