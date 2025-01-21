import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopRatedMovies } from "../utils/fetchMovies";

const PopularMovies = ({ setBestMatch }) => {
    const [movies, setMovies] = useState([]);
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        fetchTopRatedMovies(API_KEY, setMovies);
    }, [API_KEY]);

    return (
        <div>
            <h2>Popular Movies</h2>
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>
                        <Link to={`/movie/${movie.id}`} onClick={() => setBestMatch(movie)}>
                            {movie.title} ({movie.release_date ? movie.release_date.substring(0, 4) : "N/A"})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularMovies;