const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const Test = db.Test;

exports.create = async (req, res, next) => {
    if (!req.body.name || !req.body.time || !req.body.password) {
        return next(new BadRequestError(400, "Thông tin bài kiểm tra bị thiếu"));
    }
    const test = new Test({
        name: req.body.name,
        time: req.body.time,
        password: req.body.password,
        visible: String(req.body.visible).toLowerCase() === "true",
        ownerId: req.userId,
    });
    const [error, document] = await handle(test.save());
    if (error) {
        return next(
            new BadRequestError(
                500,
                "Lỗi trong quá trình tạo bài kiểm tra"
            )
        );
    }

    return res.send(document);
};

exports.findAll = async (req, res, next) => {
    const condition = {};
    const name = req.query.name;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i" };
    }
    const [error, documents] = await handle(
        Test.find(condition)
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                "Lỗi truy xuất đề bài"
            )
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    const condition = {
        _id: req.params.id,
    };
    const [error, document] = await handle(
        Test.findOne(condition)
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi truy xuất đề bài id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Đề bài không tồn tại"));
    }
    return res.send(document);
};

exports.update = async (req, res, next) => {
    if (!req.body) {
        return next(
            new BadRequestError(400, "Thông tin cập nhật đề bài bị thiếu")
        );
    }
    const condition = {
        _id: req.params.id,
    };
    const [error, document] = await handle(
        Test.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi cập nhật đề bài id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Đề bài không tồn tại"));
    }

    return res.send({ message: "Cập nhật đề bài thành công" });
};

exports.delete = async (req, res, next) => {
    const condition = {
        _id: req.params.id,
    };
    const [error, document] = await handle(
        Test.findOneAndDelete(condition, {})
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Không thể xóa đề bài id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Đề bài không tồn tại"));
    }
    return res.send({ message: "Xóa đề bài thành công" });
};
