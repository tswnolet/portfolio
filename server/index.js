import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tnolet:Scorpius1!@movies.n7xwrso.mongodb.net/?retryWrites=true&w=majority&appName=movies";
const client = new MongoClient(MONGO_URI);

const database = client.db("MovieDB");
const collection = database.collection("movies");

// Connect to MongoDB with retry logic
async function connectMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Failed. Retrying in 5 seconds...");
        setTimeout(connectMongo, 5000);
    }
}
connectMongo();

//**Search movies in MongoDB**
app.get("/api/movies/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing search query" });

    try {
        const movies = await collection
            .find({ title: { $regex: query, $options: "i" } })
            .limit(10)
            .toArray();
        res.json(movies);
    } catch (error) {
        console.error("Error searching movies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🎥 **Get full movie details**
app.get("/api/movies/:id", async (req, res) => {
    try {
        const movie = await collection.findOne({ _id: req.params.id });
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        res.json(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🏁 **Start Express Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Error Handling
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
});
