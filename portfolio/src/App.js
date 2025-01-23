import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import './styles/MovieList.css';
import './styles/Tag.css';
import "./styles/LoadingCard.css";
import "./styles/MovieDetails.css";
import "./styles/MovieList.css";
import "./styles/Nav.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import PersonDetails from "./components/PersonDetails";
import { fetchMoviesForSearch } from "./utils/fetchMovies";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [otherResults, setOtherResults] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            const data = await fetchMoviesForSearch();
            setMovies(data);
        };
        loadMovies();
    }, []);

    useEffect(() => {
        if (!query.trim() || movies.length === 0) {
            setOtherResults([]);
            return;
        }

        const filteredMovies = movies
            .filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10);

        setOtherResults(filteredMovies);
    }, [query, movies]);

    useEffect(() => {
        if (!query.trim()) {
            setOtherResults([]);
            return;
        }
    
        const fetchSearchResults = async () => {
            const results = await fetchMoviesForSearch(query);
            setOtherResults(results);
        };
    
        fetchSearchResults();
    }, [query]);    

    return (
        <Router>
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