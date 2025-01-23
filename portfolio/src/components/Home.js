import React, { useEffect, useState } from "react";
import { 
    fetchTrendingMovies, 
    fetchUpcomingMovies, 
    fetchNowPlayingMovies, 
    fetchRecentlyReleasedMovies, 
    fetchPopularMovies 
} from "../utils/fetchMovies";
import MovieGrid from "./MovieGrid";
import LoadingCard from "./LoadingCard";

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [recentlyReleasedMovies, setRecentlyReleasedMovies] = useState([]);
    const [randomMovies, setRandomMovies] = useState([]);
    const [hiddenGems, setHiddenGems] = useState([]);
    const [criticallyAcclaimed, setCriticallyAcclaimed] = useState([]);
    const count = [0, 1, 2, 3, 4, 5];

    useEffect(() => {
        const loadMovies = async () => {
            const trending = await fetchTrendingMovies();
            const upcoming = await fetchUpcomingMovies();
            const nowPlaying = await fetchNowPlayingMovies();
            const recentlyReleased = await fetchRecentlyReleasedMovies();
            const popularMovies = await fetchPopularMovies();
            
            // Pick 10 random movies from trending + popular combined
            const allMovies = [...trending, ...popularMovies];
            const randomSelection = allMovies.sort(() => 0.5 - Math.random()).slice(0, 5);
            
            // Filter "Hidden Gems" → Highly rated but not very popular
            const hiddenSelection = allMovies
                .filter(movie => movie.vote_average >= 6.5 && movie.popularity < 500)
                .slice(0, 5);
            
            // Filter "Critically Acclaimed" → Top-rated movies
            const criticallyAcclaimedSelection = allMovies
                .filter(movie => movie.vote_average >= 8.5)
                .slice(0, 5);

            setTrendingMovies(trending);
            setUpcomingMovies(upcoming);
            setNowPlayingMovies(nowPlaying);
            setRecentlyReleasedMovies(recentlyReleased);
            setRandomMovies(randomSelection);
            setHiddenGems(hiddenSelection);
            setCriticallyAcclaimed(criticallyAcclaimedSelection);
        };

        loadMovies();
    }, []);


    return (
        <div className='film-list-container'>
            <MovieGrid title="Popular This Week" movies={trendingMovies} count={5} />
            <MovieGrid title="Find Something New" movies={randomMovies} count={5} />
            {hiddenGems != "" && (
                <MovieGrid title="Hidden Gems" movies={hiddenGems} count={5} />
            )}
            {criticallyAcclaimed != "" &&
                <MovieGrid title="Critically Acclaimed" movies={criticallyAcclaimed} count={5} />
            }
            <MovieGrid title="Coming Soon" movies={upcomingMovies} count={5} />
            <MovieGrid title="Currently in Theaters" movies={nowPlayingMovies} count={5} />
            <MovieGrid title="Now on Streaming" movies={recentlyReleasedMovies} count={5} />
        </div>
    );
};

export default Home;