import { fetchPopularMovies, fetchRecentMovies, fetchTrendingMovies } from "../utils/fetchMovies";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieGrid from './MovieGrid';

const MovieList = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [recentMovies, setRecentMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [count, setCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            if (location.pathname === '/films') {
                setCount(5);
                setPopularMovies(await fetchPopularMovies());
                setRecentMovies(await fetchRecentMovies());
            } else {
                setCount(10);
            }
            setTrendingMovies(await fetchTrendingMovies());
            setLoading(false);
        };
        loadMovies();
    }, [location.pathname]);

    return (
        
        <div className='film-list-container'>
            {count === 5 && (
                <>
                    <MovieGrid title="Top 5 Most Popular Movies Right Now" loading={loading} movies={popularMovies} count={count} />
                    <MovieGrid title="Recently Rated Movies" loading={loading} movies={recentMovies} count={count} />
                </>
            )}
            <MovieGrid title={`Top ${count} Trending Movies`} loading={loading} movies={trendingMovies} count={count} />
        </div>
    );
};

export default MovieList;