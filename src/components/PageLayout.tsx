import Navbar from "./Navbar";
import React from "react";
import '../css/pageLayout.css'
import { Outlet } from "react-router-dom";

// Used in React router to give each page a universal layout (besides the login/sign up page)
// This universal layout consists of the navbar, which each page should have.
const PageLayout = () => {

    return (
        <div className="page-layout">
            <Navbar />
            <Outlet />
        </div>
    );
};
  
export default PageLayout;