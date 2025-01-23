import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";

const Nav = ({ query, setQuery, otherResults = [] }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
    
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setMenuOpen(false);
                setSearchOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Close search input when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-left">
                <div className="nav-logo">
                    <Link to="/">Silver Screened</Link>
                </div>
                <div className="nav-links">
                    <Link to="/films">Films</Link>
                    <Link to="/trending">Trending</Link>
                </div>
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                            {query && otherResults?.length > 0 && (
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

            {/* Mobile Search */}
            <div className="mobile-search-container">
                {!searchOpen ? (
                    <FaSearch className="search-icon" onClick={() => setSearchOpen(true)} />
                ) : (
                    <div className="search-input-wrapper" ref={searchInputRef}>
                        <input
                            type="text"
                            className="mobile-search-input"
                            placeholder="Search movies..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <FaTimes className="close-search" onClick={() => setSearchOpen(false)} />
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><Link to="/films" onClick={() => setMenuOpen(false)}>Films</Link></li>
                    <li><Link to="/trending" onClick={() => setMenuOpen(false)}>Trending</Link></li>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;