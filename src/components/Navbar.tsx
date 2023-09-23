import '../css/navbar.css';
import React from 'react';
import {BiUserCircle} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const { setIsAuthenticated } = useAuth()

    return (
        <nav className="main-navbar">
            <Link className={location.pathname.includes("drafts") ? "option active" : "option"} 
            to="/modules/drafts" 
            >
                Mock Drafts
            </ Link>
            <div className="user option">
                <BiUserCircle className="user-icon" />
                <ul>
                    <li onClick={() => {
                        localStorage.removeItem("jwtToken");
                        setIsAuthenticated(false);
                    }}>Logout</li>
                    <li>Settings</li>
                </ul>
            </div>
        </nav>
    );
};
  
export default Navbar;