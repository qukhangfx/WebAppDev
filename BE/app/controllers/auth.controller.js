const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const User = db.User;

exports.signup = async (req, res, next) => {
    const user = new User({
        fullname: "",
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        isAdmin: req.body.username === "admin",
        isActive: false,
    });

    const [error] = await handle(user.save());

    if (error) {
        let statusCode = 400;
        let { username = {}, email = {}, password = {} } = error.errors;

        const errorMessage =
            username.message || email.message || password.message;
        if (!errorMessage) {
            statusCode = 500;
        }

        return next(new BadRequestError(statusCode, errorMessage));
    }

    res.send({ message: "Tài khoản đã được tạo thành công" });
};

exports.signin = async (req, res, next) => {
    const [error, user] = await handle(
        User.findOne({
            username: req.body.username,
        }).exec()
    );

    if (error) {
        console.log(error);
        return next(new BadRequestError(500));
    }

    if (!user) {
        return next(new BadRequestError(401, "Tên đăng nhập hoặc mật khẩu sai"));
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return next(new BadRequestError(401, "Tên đăng nhập hoặc mật khẩu sai"));
    }

    if (!user.isActive && !user.isAdmin) {
        return next(new BadRequestError(401, "Bạn chưa được cấp quyền truy cập vào hệ thống"))
    }

    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
        expiresIn: 86400,
    });

    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        accessToken: token,
    });
};


exports.update = async (req, res, next) => {
    if (!req.body) {
        return next(
            new BadRequestError(400, "Thông tin cập nhật tài khoản bị thiếu")
        );
    }
    const condition = {
        _id: req.params.id,
        username: req.body.username,
    };
    const [error, document] = await handle(
        User.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi cập nhật tài khoản id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Tài khoản không tồn tại"));
    }

    return res.send({ message: "Cập nhật tài khoản thành công" });
};

exports.findAll = async (req, res, next) => {
    const [error, documents] = await handle(
        User.find(
            {},
        )
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi trong quá trình truy xuất dữ liệu`
            )
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    const [error, documents] = await handle(
        User.findOne(
            { _id: req.params.id, },
        )
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi trong quá trình truy xuất dữ liệu`
            )
        );
    }
    return res.send(documents);
};