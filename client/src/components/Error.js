import React from "react";
import "./mix.css";
import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <>
      <div className="error">
        <h1>Page not found</h1>
        <div className="gotohome">
          <h2>
            <NavLink to="/">go to home page</NavLink>
          </h2>
        </div>
      </div>
    </>
  );
};

export default Error;
