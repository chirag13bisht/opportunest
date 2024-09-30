
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('SECRET_KEY not defined');
        }
        
        const token = req.cookies.jwtoken;
       

        if (!token) {
            return res.status(401).send('No token provided');
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      

        const rootUser = await User.findOne({
            _id: verifyToken._id,
            "tokens.token": token,
        });

        if (!rootUser) {
            throw new Error('User not found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.UserID = rootUser._id;
        next();
    } catch (error) {
        console.log('Error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired');
        }
        res.status(401).send('Unauthorized: Invalid token');
    }
};
 

module.exports = authenticate;

