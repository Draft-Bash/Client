import Navbar from "./Navbar";
import React from "react";
import '../css/pageLayout.css'
import { Outlet } from "react-router-dom";

// Layout for all pages beside the login/signup pages.
const PageLayout = () => {

    return (
        <div className="page-layout">
            <Navbar />
            <Outlet />
        </div>
    );
};
  
export default PageLayout;