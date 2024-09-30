const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
       
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const rootUser = await User.findOne({
            _id: verifyToken._id,
            "tokens.token": token,
        });

        if (!rootUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.token = token;
        req.rootUser = rootUser;
        req.UserID = rootUser._id;
        next();
    } catch (error) {
        console.log('Error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(500).json({ message: 'Server error during authentication' });
        }
    }
};

module.exports = authenticate;
