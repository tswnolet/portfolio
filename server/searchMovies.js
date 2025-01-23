import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { getSimilarity, phraseMatch, abbreviationMatch, typoCorrectionScore } from "./utils/similarity.js"; 

dotenv.config(); // Load environment variables from .env

// MongoDB connection settings
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tnolet:Scorpius1!@movies.n7xwrso.mongodb.net/?retryWrites=true&w=majority&appName=movies";
const DATABASE_NAME = "MovieDB";
const COLLECTION_NAME = "movies";

// MongoDB Client
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function searchMovieLocally(query, limit = 10) {
    if (!query.trim()) return [];

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Fetch all movies for fuzzy matching
        const movies = await collection.find().toArray();

        const queryWords = query.toLowerCase().split(" ");

        const processedResults = movies
            .map(movie => {
                const similarityScore = getSimilarity(query, movie.title);
                const phraseScore = phraseMatch(query, movie.title);
                const abbreviationScore = abbreviationMatch(query, movie.title);
                const typoCorrection = typoCorrectionScore(query, movie.title);

                // Enforce stricter match rules
                const wordsInTitle = movie.title.toLowerCase().split(" ");
                const wordOverlap = queryWords.filter(word => wordsInTitle.includes(word)).length;
                const wordPenalty = wordOverlap === 0 ? -50 : 0;

                // Final ranking score
                const finalScore =
                    similarityScore * 0.7 +
                    phraseScore * 15 +
                    abbreviationScore * 8 +
                    typoCorrection * 5 - 
                    wordPenalty;

                return { ...movie, finalScore };
            })
            .filter(movie => movie.finalScore > 40) // Filter out bad matches
            .sort((a, b) => b.finalScore - a.finalScore)
            .slice(0, limit); // Limit results

        return processedResults;
    } catch (error) {
        console.error("Error searching movies from MongoDB:", error);
        return [];
    } finally {
        await client.close();
    }
}

// Example Usage
(async () => {
    const searchQuery = "Harry Potter"; // Change this for testing
    const results = await searchMovieLocally(searchQuery, 10);
    console.log("Search Results:", results);
})();