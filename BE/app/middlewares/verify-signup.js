const { BadRequestError } = require("../helpers/errors");
const db = require("../models");
const User = db.User;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({
            username: req.body.username,
        }).exec();

        if (userByUsername) {
            return next(new BadRequestError(422, "Tên đăng nhập đã được sử dụng"));
        }

        const userByEmail = await User.findOne({
            email: req.body.email,
        }).exec();

        if (userByEmail) {
            return next(new BadRequestError(422, "Địa chỉ email đã được sử dụng"));
        }

        return next();
    } catch (error) {
        console.log(error);
        return next(new BadRequestError(500));
    }
};

module.exports = {
    checkDuplicateUsernameOrEmail,
};
