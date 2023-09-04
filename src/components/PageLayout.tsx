import Navbar from "./Navbar";
import React from "react";
import '../css/pageLayout.css'
import { Outlet } from "react-router-dom";

const PageLayout = () => {

    return (
        <div className="page-layout">
            <Navbar />
            <Outlet />
        </div>
    );
};
  
export default PageLayout;