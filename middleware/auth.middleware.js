const {blacklistModel} = require('../model/blacklist.model.js');
const {UserModel} = require('../model/user.model.js');
const jwt = require('jsonwebtoken');

const auth = async function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const blackListed = await blacklistModel.findOne({token});
        if (blackListed) throw new Error('Please Login');
        jwt.verify(token, 'masaiA', async function (err, decoded) {
            if (err) throw new Error(err.message);
            if (!decoded) throw new Error('Invalid Token');
            else {
                const user = await UserModel.findOne({_id: decoded.userID});
                req.body.userName = user.name;
                req.body.userID = decoded.userID;
                req.body.role = user.role;
                next();
            }
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

module.exports = {auth}