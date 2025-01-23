import React, { useState, useEffect } from "react";

const Poster = () => {
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjQzNWM3NjM3YTkxMTk0ZGRmYmE0Y2I2MGY4YTIyYiIsIm5iZiI6MTczNzI0MzkwMi4wMzIsInN1YiI6IjY3OGMzY2ZlNDJmMjdjNzU0YzY1MDI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G3C0WA05F6CBl9JwSIgTRqrypMleiKhLJ4CPYKHg-Ao",
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.posters.length > 0) {
                    const highestRatedPoster = data.posters.reduce(
                        (acc, poster) => (poster.vote_average > acc.vote_average ? poster : acc),
                        { vote_average: 0 }
                    );

                    setPoster(highestRatedPoster);
                }
            } catch (error) {
                console.error("Error fetching movie images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div className="poster-container">
            {poster && poster.file_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Movie Poster"
                    className="movie-poster"
                />
            ) : (
                <p>Loading images...</p>
            )}
        </div>
    );
};

export default Poster;