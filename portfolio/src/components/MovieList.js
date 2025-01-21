import '../styles/MovieList.css';
import { fetchPopularMovies, fetchRecentMovies, fetchTrendingMovies } from "../utils/fetchMovies";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieGrid from './MovieGrid';

const MovieList = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [recentMovies, setRecentMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [count, setCount] = useState(10);
    const location = useLocation();

    useEffect(() => {
        const loadMovies = async () => {
            if (location.pathname === '/films') {
                setCount(5);
                setPopularMovies(await fetchPopularMovies());
                setRecentMovies(await fetchRecentMovies());
            } else {
                setCount(10);
            }
            setTrendingMovies(await fetchTrendingMovies());
        };
        loadMovies();
    }, [location.pathname]);

    return (
        
        <div className='film-lists'>
            {count === 5 && (
                <>
                    <MovieGrid title="Top 5 Most Popular Movies Right Now" movies={popularMovies} count={count} />
                    <MovieGrid title="Recently Rated Movies" movies={recentMovies} count={count} />
                </>
            )}
            <MovieGrid title={`Top ${count} Trending Movies`} movies={trendingMovies} count={count} />
        </div>
    );
};

export default MovieList;