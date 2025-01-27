import React from "react";
import { Link } from "react-router-dom";
import LoadingCard from "./LoadingCard";

const MovieGrid = ({ title, movies, count }) => {
    return (
        <div className="section">
            <h2>{title}</h2>
            <div className="movie-grid">
                {movies.slice(0, count).map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                        <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MovieGrid;
