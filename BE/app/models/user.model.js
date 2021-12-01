module.exports = mongoose => {
    const schema = mongoose.Schema({
        fullname: {
            type: String
        },
        username: {
            type: String,
            required: [true, "Ten dang nhap la bat buoc"],
        },
        email: {
            type: String,
            required: [true, "Email la bat buoc"],
        },
        password: {
            type: String,
            required: [true, "Mat khau la bat buoc"],
        },
        isAdmin: {
            type: Boolean
        },
        isActive: {
            type: Boolean
        },
    });

    return mongoose.model("user", schema);
};
