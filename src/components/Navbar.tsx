import '../css/navbar.css';
import React from 'react';
import {BiUserCircle} from 'react-icons/bi';
import {AiOutlineMail} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { useLocation } from 'react-router-dom';
import Invites from './Invites';
import HelpModal from './HelpModal';

const Navbar = () => {
    const location = useLocation();

    const { setIsAuthenticated } = useAuth()

    return (
        <nav className="main-navbar">
            <HelpModal />
            <Link className={location.pathname.includes("drafts") ? "option active" : "option"} 
            to="/modules/drafts" 
            >
                Mock Drafts
            </ Link>
            <Invites />
            <div className="user">
                <BiUserCircle className="nav-icon" />
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