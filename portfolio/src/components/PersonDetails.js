import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY; // Ensure your .env file has this

const PersonDetails = () => {
    const { id } = useParams(); // Get actor ID from URL
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            try {
                const response = await axios.get(`${TMDB_API_BASE_URL}/person/${id}`, {
                    params: {
                        append_to_response: "movie_credits,tv_credits,images,external_ids",
                    },
                    headers: { Authorization: `Bearer ${TMDB_API_KEY}` }
                });

                setPerson(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching person details:", error);
                setLoading(false);
            }
        };

        fetchPersonDetails();
    }, [id]);

    if (loading) return <p>Loading actor details...</p>;
    if (!person) return <p>Actor details not found.</p>;

    return (
        <div>
            <h1>{person.name}</h1>
            {person.profile_path && (
                <img src={`https://image.tmdb.org/t/p/w300${person.profile_path}`} alt={person.name} />
            )}
            <p><strong>Biography:</strong> {person.biography || "No biography available."}</p>
            
            <h2>Movies</h2>
            <ul>
                {person.movie_credits?.cast?.slice(0, 10).map((movie) => (
                    <li key={movie.id}>
                        <strong>{movie.title}</strong> ({movie.release_date?.split("-")[0] || "N/A"})
                    </li>
                ))}
            </ul>

            <h2>TV Shows</h2>
            <ul>
                {person.tv_credits?.cast?.slice(0, 10).map((show) => (
                    <li key={show.id}>
                        <strong>{show.name}</strong> ({show.first_air_date?.split("-")[0] || "N/A"})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonDetails;