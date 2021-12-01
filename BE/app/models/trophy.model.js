module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            username: {
                type: String,
                required: [true, "Can nhap ten tai khoan"],
            },
            testId: {
                type: String,
                required: [true, "Can nhap ma bai kiem tra"],
            },
            score: {
                type: Number
            },
            ownerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
        },
        { timestamps: true }
    );

    // Replace _id with id and remove __V
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("trophy", schema);
};
