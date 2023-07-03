const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {blacklistModel} = require('../model/blacklist.model');
const {UserModel} = require('../model/user.model');
const userRouter = express.Router();

userRouter.post('/register', registerLogic);
userRouter.post('/login', loginLogic);
userRouter.get('/refreshToken', refreshTokenLogic);
userRouter.get('/logout', logoutLogic);

async function registerLogic(req, res) {
    try {
        const {name, email, pass, role} = req.body;
        bcrypt.hash(pass, 5, async function (err, hash) {
            if (err) throw new Error(err.message);
            const newUser = new UserModel({name, email, pass: hash, role});
            await newUser.save();
            return res.status(200).json({
                status: 'ok',
                message: 'Registration Successful',
                user: req.body,
            });
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function loginLogic(req, res) {
    try {
        const {email, pass} = req.body;
        const user = await UserModel.findOne({email});
        if (!user) throw new Error('Use not found');
        bcrypt.compare(pass, user.pass, function (err, result) {
            if (err) throw new Error(err.message);
            if (!result) throw new Error('Wrong Password');
            if (result) {
                const aToken = jwt.sign(
                    {userID: user._id, userName: user.name},
                    'masaiA',
                    {expiresIn: `${100 * 60 * 1000}`}
                );
                const rToken = jwt.sign(
                    {userID: user._id, userName: user.name},
                    'masaiR',
                    {expiresIn: `${300 * 60 * 1000}`}
                );
                res.status(200).json({
                    status: 'ok',
                    message: 'Login Successful',
                    aToken: aToken,
                    rToken: rToken,
                });
            }
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function refreshTokenLogic(req, res) {
    const rToken = req.headers.authorization?.split(' ')[1];

    try {
        if (!rToken) throw new Error('Token not found');
        jwt.verify(rToken, 'masaiR', function (err, decoded) {
            if(err) throw new Error(err.message)
            if (!decoded) throw new Error('Invalid Token');
            else {
                const aToken = jwt.sign(
                    {userID: decoded.userID, userName: decoded.userName},
                    'masaiA',
                    {expiresIn: `${1 * 60 * 1000}`}
                );

                const rToken = jwt.sign(
                    {userID: decoded.userID, userName: decoded.userName},
                    'masaiR',
                    {expiresIn: `${3 * 60 * 1000}`}
                )
                return res.status(200).json({
                    status: 'ok',
                    aToken: aToken,
                    rToken: rToken
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function logoutLogic(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Token not found');
        const newBlackListToken = await new blacklistModel({token});
        newBlackListToken.save();
        return res.status(400).json({
            status: 'ok',
            message: 'Log Out successful',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

module.exports = {userRouter};
