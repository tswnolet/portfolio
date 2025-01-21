import React, { useEffect, useState } from "react";
import { fetchUpcomingMovies, fetchNowPlayingMovies, fetchRecentlyReleasedMovies } from "../utils/fetchMovies";
import MovieGrid from "./MovieGrid";

const Home = () => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [recentlyReleasedMovies, setRecentlyReleasedMovies] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            setUpcomingMovies(await fetchUpcomingMovies());
            setNowPlayingMovies(await fetchNowPlayingMovies());
            setRecentlyReleasedMovies(await fetchRecentlyReleasedMovies());
        };

        loadMovies();
    }, []);

    return (
        <div>
            <h1>🎬 Upcoming Movies (Next 2 Months)</h1>
            <MovieGrid movies={upcomingMovies} />

            <h1>🍿 Now Playing in Theaters</h1>
            <MovieGrid movies={nowPlayingMovies} />

            <h1>📺 Recently Released for Streaming</h1>
            <MovieGrid movies={recentlyReleasedMovies} />
        </div>
    );
};

export default Home;