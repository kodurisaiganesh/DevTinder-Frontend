import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const PublicLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="auth-main flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
