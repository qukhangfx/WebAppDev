const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const Trophy = db.Trophy;

exports.create = async (req, res, next) => {
    if (!req.body.username || !req.body.testId) {
        return next(new BadRequestError(400, "Thông tin bài làm kiểm tra bị thiếu"));
    }
    const trophy = new Trophy({
        username: req.body.username,
        testId: req.body.testId,
        score: req.body.score,
        ownerId: req.userId,
    });
    const [error, document] = await handle(trophy.save());
    if (error) {
        return next(
            new BadRequestError(
                500,
                "Lỗi trong quá trình tạo bài làm kiểm tra"
            )
        );
    }

    return res.send(document);
};

exports.findAll = async (req, res, next) => {
    const condition = {};
    const testId = req.params.testId;
    if (testId) {
        condition.testId = { $regex: new RegExp(testId), $options: "i" };
    }
    const [error, documents] = await handle(
        Trophy.find(condition).sort({
            score: -1
        }).limit(30)
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                "Lỗi truy xuất danh sách bài làm"
            )
        );
    }
    return res.send(documents);
};