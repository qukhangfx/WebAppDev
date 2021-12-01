const express = require("express");
const cors = require("cors");
const config = require("./app/config");
const setupQuestionRoutes = require("./app/routes/question.routes");
const setupTestRoutes = require("./app/routes/test.routes");
const setupAuthRoutes = require("./app/routes/auth.routes");
const setupTrophyRoutes = require("./app/routes/trophy.routes");
const { BadRequestError } = require("./app/helpers/errors");
const db = require("./app/models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
    .connect(config.db.url)
    .then(() => {
        console.log("Connect to database successfully");
    })
    .catch((error) => {
        console.log("Connect to database unsuccessfully", error);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Anh Ngu Simple API" });
});

setupQuestionRoutes(app);
setupTestRoutes(app);
setupAuthRoutes(app);
setupTrophyRoutes(app);

// handle 404 response
app.use((req, res, next) => {
    next(new BadRequestError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

// set port, listen for requests
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
