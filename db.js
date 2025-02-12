// db.js
const mongoose = require("mongoose");

const mongoURI = "mongodb://mongo-service.default.svc.cluster.local:27017/schoolDB";
// Change localhost to mongo, which is the service name in docker-compose
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
const connectWithRetry = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => {
        console.error("Failed to connect to MongoDB, retrying...", err);
        setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    });
};

connectWithRetry();
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
