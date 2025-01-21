import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFullMovieDetails } from "../utils/fetchMovies";
import crewCategories from "../data/crewCategories.json";
import CrewSection from "./CrewSection";
import Tag from "./Tag";
import { Link } from "react-router-dom";
import "../styles/MovieDetails.css";
import fandangoLogo from "../assets/fandango logo.svg"; // Ensure this is correctly linked

const MovieDetails = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [activeTab, setActiveTab] = useState("cast");
    const [watchProviders, setWatchProviders] = useState(null);

    useEffect(() => {
        const loadMovie = async () => {
            const data = await fetchFullMovieDetails(movieId);
            setMovie(data);
        };
        loadMovie();
    }, [movieId]);

    useEffect(() => {
        const fetchWatchProviders = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                            Accept: "application/json"
                        }
                    }
                );
    
                const data = await response.json();
                setWatchProviders(data.results?.US || {}); // Only store U.S. providers
                console.log("Watch Providers:", data);
            } catch (error) {
                console.error("❌ Error fetching watch providers:", error);
            }
        };
    
        fetchWatchProviders();
    }, [movieId]);    

    if (!movie) return <p>Loading...</p>;

    // Extract Data
    const cast = movie.credits?.cast || [];
    const crew = movie.credits?.crew || [];
    const productionCompanies = movie.production_companies || [];

    // Get Directors
    const directors = crew
        .filter((member) => member.job === "Director")
        .map((director) => director.name)
        .join(", ");

    // Get Backdrop Image or Fallback to Poster
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : movie.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : "";

    // Get Where to Watch
    const streamingProviders = watchProviders?.flatrate || [];
    const rentalProviders = watchProviders?.rent || [];
    const theaterLink = `https://www.fandango.com/search?q=${encodeURIComponent(movie.title)}`;

    return (
        <div className="movie-details">
            {/* Movie Hero Section with Backdrop */}
            <div className="movie-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
                <div className="movie-hero-overlay">
                    <div className="movie-title-container">
                        {/* MOVIE TITLE INFO */}
                        <div className="movie-title-info">
                            <h1>{movie.title} ({movie.release_date?.substring(0, 4)})</h1>
                            <div className="movie-meta">
                                <span>🎬 Directed by {directors || "Unknown"}</span>
                                <span>⏳ {movie.runtime} min</span>
                            </div>
                        </div>
                        
                        {/* MOVIE POSTER */}
                        {movie.poster_path && (
                            <img 
                                className="movie-page-poster"
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                                alt={movie.title} 
                            />
                        )}
                    </div>
                </div>
                <div className="gradient-overlay"></div>
            </div>

            {/* Watch Providers (Fixed Sidebar) */}
            <div className="watch-sidebar">
                <h3>Where to Watch</h3>
                {streamingProviders.length > 0 ? (
                    <div className="watch-providers">
                        {streamingProviders.map((provider) => (
                            <img
                                key={provider.provider_id}
                                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="watch-logo"
                            />
                        ))}
                    </div>
                ) : (
                    <a 
                        href={theaterLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="fandango-link"
                    >
                        Buy Tickets
                    </a>
                )}
            </div>

            {/* Movie Details Section */}
            <div className="movie-content">
                <p className="movie-overview">{movie.overview}</p>

                {/* Mini Nav Bar for Switching Sections */}
                <div className="movie-nav">
                    <button onClick={() => setActiveTab("cast")} className={activeTab === "cast" ? "active" : ""}>
                        Cast
                    </button>
                    <button onClick={() => setActiveTab("crew")} className={activeTab === "crew" ? "active" : ""}>
                        Crew
                    </button>
                    <button onClick={() => setActiveTab("production")} className={activeTab === "production" ? "active" : ""}>
                        Production
                    </button>
                </div>
            </div>

            {/* Content Sections Based on Active Tab */}
            <div className="movie-sections">
                {activeTab === "cast" && (
                    <div className="cast-section">
                        {cast.slice(0, 15).map((actor) => (
                            <Link to={`/person/${actor.id}`} key={actor.id}>
                                <Tag id={actor.id} name={actor.name} role={actor.character} />
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === "crew" && (
                    <div className="crew-section">
                        {crewCategories.map(({ title, jobs }) => (
                            <CrewSection key={title} crew={crew} title={title} jobFilter={jobs} />
                        ))}
                    </div>
                )}

                {activeTab === "production" && (
                    <div className="production-section">
                        {productionCompanies.map((company) => (
                            <div key={company.id} className="production-company">
                                {company.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;