import '../css/navbar.css'; // Import CSS for styling
import React from 'react';
import { BiUserCircle } from 'react-icons/bi'; // Import user icon
import { Link } from 'react-router-dom'; // Import Link component for routing
import { useAuth } from '../authentication/AuthContext'; // Import authentication context
import { useLocation } from 'react-router-dom'; // Import useLocation hook for tracking the current route

const Navbar = () => {
    const location = useLocation(); // Get the current route location

    const { setIsAuthenticated } = useAuth(); // Access authentication context

    return (
        <nav className="main-navbar"> {/* Main navigation container */}
            <Link
                className={location.pathname.includes("drafts") ? "option active" : "option"} // Add "active" class if the route includes "drafts"
                to="/modules/drafts" // Link to the "/modules/drafts" route
            >
                Mock Drafts {/* Display the "Mock Drafts" option */}
            </ Link>
            <div className="user option"> {/* User-related options */}
                <BiUserCircle className="user-icon" /> {/* User icon */}
                <ul>
                    <li
                        onClick={() => {
                            localStorage.removeItem("jwtToken"); // Remove JWT token from local storage on logout
                            setIsAuthenticated(false); // Set isAuthenticated to false in the authentication context
                        }}
                    >
                        Logout {/* Display the "Logout" option */}
                    </li>
                    <li>Settings</li> {/* Display the "Settings" option */}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar; // Export the Navbar component as the default export