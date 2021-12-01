const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const Question = db.Question;

exports.create = async (req, res, next) => {
    if (!req.body.content || !req.body.a || !req.body.b || !req.body.c || !req.body.d || !req.body.answer || !req.body.testId) {
        return next(new BadRequestError(400, "Thông tin câu hỏi bị thiếu"));
    }
    const question = new Question({
        content: req.body.content,
        a: req.body.a,
        b: req.body.b,
        c: req.body.c,
        d: req.body.d,
        answer: req.body.answer,
        type: req.body.type,
        testId: req.body.testId,
        ownerId: req.userId,
    });
    const [error, document] = await handle(question.save());
    if (error) {
        return next(
            new BadRequestError(
                500,
                "Lỗi trong quá trình thêm câu hỏi"
            )
        );
    }

    return res.send(document);
};

exports.update = async (req, res, next) => {
    if (!req.body) {
        return next(
            new BadRequestError(400, "Thông tin cập nhật bị thiếu")
        );
    }
    const condition = {
        _id: req.params.id,
    };
    const [error, document] = await handle(
        Question.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi cập nhật câu hỏi id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Câu hỏi không tồn tại"));
    }
    return res.send({ message: "Cập nhật câu hỏi thành công" });
};

exports.delete = async (req, res, next) => {
    const condition = {
        _id: req.params.id,
    };
    const [error, document] = await handle(
        Question.findOneAndDelete(condition, {})
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Không thể xóa câu hỏi id=${req.params.id}`
            )
        );
    }
    if (!document) {
        return next(new BadRequestError(404, "Câu hỏi không tồn tại"));
    }

    return res.send({ message: "Xóa câu hỏi thành công" });
};

exports.findAll = async (req, res, next) => {
    const [error, documents] = await handle(
        Question.find(
            {
                testId: req.params.testId,
            },
        ).sort({
            a: Math.floor(Math.random() * 100) % 2 === 0 ? 1 : -1,
            b: Math.floor(Math.random() * 1000) % 2 === 0 ? 1 : -1,
            c: Math.floor(Math.random() * 10000) % 2 === 0 ? 1 : -1,
            d: Math.floor(Math.random() * 100000) % 2 === 0 ? 1 : -1,
        })
    );
    if (error) {
        return next(
            new BadRequestError(
                500,
                `Lỗi trong quá trình truy xuất dữ liệu testId=${req.params.testId}`
            )
        );
    }
    return res.send(documents);
};
