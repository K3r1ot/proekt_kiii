const mongoose = require("mongoose");


const mongoURI = process.env.DB_URI || "mongodb://mongo-0.mongo-service.default.svc.cluster.local:27017,mongo-1.mongo-service.default.svc.cluster.local:27017,mongo-2.mongo-service.default.svc.cluster.local:27017/schoolDB?replicaSet=rs0";

console.log(mongoURI)

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
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB Connected Successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err);
});
mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB Disconnected'));
connectWithRetry();


const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});


const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
