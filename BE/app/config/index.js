const config = {
    app: {
        port: process.env.PORT || 8080
    },
    db: {
        url: "mongodb://localhost:27017/anhngusimple"
    },
    jwt: {
        secret: "anhngusimple-secret-key"
    }
};

module.exports = config;
