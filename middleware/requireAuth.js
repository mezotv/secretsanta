const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
        console.log("No authorization header");
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findOne({ _id }).select("_id");
        next();
    } catch (error) {
        console.log("Error:", error.message);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

module.exports = requireAuth