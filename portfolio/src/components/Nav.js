import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Nav.css";

const Nav = ({ query, setQuery, otherResults = [] }) => { // ✅ Ensure default empty array
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-left">
                <div className="nav-logo">
                    <Link to="/">🎬 MovieDB</Link>
                </div>
                <div className="nav-links">
                    <Link to="/films">Films</Link>
                    <Link to="/trending">Trending</Link>
                </div>
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && otherResults?.length > 0 && ( // ✅ Safe check
                    <div className="search-dropdown">
                        {otherResults.map((movie) => (
                            <Link key={movie.id} to={`/movie/${movie.id}`} onClick={() => setQuery("")}>
                                {movie.title} ({movie.year ? movie.year.substring(0, 4) : "N/A"})
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Login Button */}
            <div className="nav-auth">
                <Link to="/login">Login / Sign Up</Link>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><Link to="/films" onClick={() => setMenuOpen(false)}>Films</Link></li>
                    <li><Link to="/trending" onClick={() => setMenuOpen(false)}>Trending</Link></li>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link></li>
                </ul>

                {/* Mobile Search Bar */}
                <div className="search-container mobile-search">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && Array.isArray(otherResults) && otherResults.length > 0 && (
                        <div className="search-dropdown">
                            {otherResults.map((movie) => (
                                <Link key={movie.id} to={`/movie/${movie.id}`} onClick={() => setQuery("")}>
                                    {movie.title} ({movie.year ? movie.year.substring(0, 4) : "N/A"})
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;