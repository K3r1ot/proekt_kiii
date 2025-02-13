const mongoose = require("mongoose");


const mongoURI = process.env.DB_URI || "mongodb://mongo-service.default.svc.cluster.local:27017/schoolDB";
console.log(process.env.DB_URI)

const connectWithRetry = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Failed to connect to MongoDB, retrying...", err);

        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();


const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Export the model
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
