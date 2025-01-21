import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import PersonDetails from "./components/PersonDetails";
import { fetchMoviesForSearch } from "./utils/fetchMovies";

function App() {
    const [query, setQuery] = useState(""); // Search query state
    const [movies, setMovies] = useState([]); // Store all movies
    const [otherResults, setOtherResults] = useState([]); // Search results

    // 🔹 Fetch movies once when the app loads
    useEffect(() => {
        const loadMovies = async () => {
            const data = await fetchMoviesForSearch();
            console.log("📥 Loaded Movies from API:", data);
            setMovies(data);
        };
        loadMovies();
    }, []);

    // 🔍 Update search results when query or movies list changes
    useEffect(() => {
        if (!query.trim() || movies.length === 0) {
            console.log("❌ No query or empty movie list, resetting results.");
            setOtherResults([]);
            return;
        }

        // 🔹 Filter movies based on the search query
        const filteredMovies = movies
            .filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10); // Limit results

        console.log("✅ Filtered Movies:", filteredMovies);
        setOtherResults(filteredMovies);
    }, [query, movies]);

    return (
        <Router>
            <Nav query={query} setQuery={setQuery} otherResults={otherResults} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/films" element={<MovieList />} />
                <Route path="/trending" element={<MovieList />} />
                <Route path="/movie/:movieId" element={<MovieDetails />} />
                <Route path="/person/:id" element={<PersonDetails />} />
                <Route path="/login" element={<div><h1>Login Page</h1></div>} />
            </Routes>
        </Router>
    );
}

export default App;