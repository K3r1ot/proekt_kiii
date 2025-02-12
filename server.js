const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Get all subjects
app.get("/api/subjects", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Subjects");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single subject
app.get("/api/subjects/:id", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM Subjects WHERE id = @id");
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new subject
app.post("/api/subjects", async (req, res) => {
    const { name, description } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("name", sql.VarChar, name)
            .input("description", sql.Text, description)
            .query(
                "INSERT INTO Subjects (name, description) OUTPUT INSERTED.* VALUES (@name, @description)"
            );
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a subject
app.put("/api/subjects/:id", async (req, res) => {
    const { name, description } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .input("name", sql.VarChar, name)
            .input("description", sql.Text, description)
            .query(
                "UPDATE Subjects SET name = @name, description = @description WHERE id = @id"
            );
        res.json({ message: "Subject updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a subject
app.delete("/api/subjects/:id", async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM Subjects WHERE id = @id");
        res.json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
