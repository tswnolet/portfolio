import axios from "axios";

const API_BASE_URL = "https://api.silverscreened.com";
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const TMDB_HEADERS = {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    Accept: "application/json",
};

export const fetchMoviesForSearch = async (query) => {
    if (!query) return [];

    try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/search?q=${query}`, {
            headers: { "Cache-Control": "no-cache" },
        });

        return Array.isArray(response.data) ? response.data : []; // 🔥 Ensure it's always an array
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

//Fetch trending movies from TMDB API
export const fetchTrendingMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/trending/movie/week`, { headers: TMDB_HEADERS });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching trending movies from TMDB:", error);
        return [];
    }
};

//Fetch recent movies from TMDB API
export const fetchRecentMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/now_playing`, { headers: TMDB_HEADERS });
        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching recent movies from TMDB:", error);
        return [];
    }
};

//Fetch popular movies from TMDB API
export const fetchPopularMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/popular`, {
            headers: TMDB_HEADERS,
        });

        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching popular movies from TMDB:", error);
        return [];
    }
};

//Fetch movie details from TMDB API
export const fetchMovieDetails = async (movieId) => {
    if (!movieId) {
        console.error("fetchMovieDetails: Invalid movie ID", movieId);
        return null;
    }

    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}`, {
            headers: TMDB_HEADERS,
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching movie details (ID: ${movieId}) from TMDB:`, error);
        return null;
    }
};

/*
    Fetch full movie details from TMDB API, including:
        - Movie info
        - Cast & Crew
        - Videos (Trailers, Clips)
        - Images (Backdrops, Posters)
        - Release Dates
        - Production Companies
        - Keywords
        - Recommendations & Similar Movies
*/

export const fetchFullMovieDetails = async (movieId) => {
    if (!movieId) {
        console.error("fetchFullMovieDetails: Invalid movie ID", movieId);
        return null;
    }

    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}`, {
            headers: TMDB_HEADERS,
            params: {
                append_to_response: "credits,videos,images,release_dates,keywords,recommendations,similar"
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching full details for movie (ID: ${movieId}) from TMDB:`, error);
        return null;
    }
};

export const fetchPersonDetails = async (personId) => {
    if (!personId) return null;

    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/person/${personId}`, {
            params: {
                append_to_response: "movie_credits,tv_credits,images,external_ids",
            },
            headers: { Authorization: `Bearer ${TMDB_API_KEY}` }
        });

        return {
            ...response.data,
            known_for: response.data.movie_credits.cast.slice(0, 10), // Show top 10 movies
        };
    } catch (error) {
        console.error(`Error fetching details for person ID ${personId}:`, error);
        return null;
    }
};

//Fetch movies releasing soon (Next 2 Months)
export const fetchUpcomingMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/upcoming`, {
            headers: TMDB_HEADERS,
            params: {
                language: "en-US",
                region: "US", // Only fetch movies releasing in the US
            },
        });

        // Filter only movies coming in the next 2 months
        const currentDate = new Date();
        const twoMonthsLater = new Date();
        twoMonthsLater.setMonth(currentDate.getMonth() + 2);

        return response.data.results.filter(movie => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate >= currentDate && releaseDate <= twoMonthsLater;
        });
    } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        return [];
    }
};

// 🎭 Fetch movies currently in theaters
export const fetchNowPlayingMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/movie/now_playing`, {
            headers: TMDB_HEADERS,
            params: { language: "en-US", region: "US" },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
        return [];
    }
};

// 📺 Fetch movies recently released for streaming (Last 3 months)
export const fetchRecentlyReleasedMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/discover/movie`, {
            headers: TMDB_HEADERS,
            params: {
                language: "en-US",
                region: "US",
                "release_date.gte": getThreeMonthsAgoDate(),
                "release_date.lte": getCurrentDate(),
                "with_release_type": "3|4", // Fetch movies available on digital/streaming
            },
        });

        return response.data.results;
    } catch (error) {
        console.error("Error fetching recently released movies:", error);
        return [];
    }
};

// Helper functions to get dates
const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
};

const getThreeMonthsAgoDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split("T")[0];
};