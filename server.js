const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Subject } = require("./db");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find(); // Get all subjects
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/subjects/:id", async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id); // Find a subject by ID
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/subjects", async (req, res) => {
    const { name, description } = req.body;
    try {
        const newSubject = new Subject({ name, description });
        await newSubject.save();
        res.status(201).json(newSubject); // Send back the created subject
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/subjects/:id", async (req, res) => {
    const { name, description } = req.body;
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true } // Return the updated document
        );
        if (!updatedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.json(updatedSubject); // Send back the updated subject
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/subjects/:id", async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
