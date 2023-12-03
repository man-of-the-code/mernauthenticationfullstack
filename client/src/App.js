import React, { useEffect, useState } from "react";
import Context from "./components/ContextProvider/Context";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Error from "./components/Error";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const App = () => {
  const [Data, setData] = useState(false);
  const history = useNavigate();
  const dashboardValid = async () => {
    const token = localStorage.getItem("logintoken");
    const res = await fetch("/uservalid", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    if (data.status === 401 || data.status === 422 || !data) {
      //history("/");
      console.log("Invalid User");
    } else {
      //console.log("user verify");
      history("/dash");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setData(true);
      dashboardValid();
    }, 2000);
  }, []);

  return (
    <>
      {Data ? (
        <>
          <Context>
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dash" element={<Dashboard />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Context>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            Loading... &nbsp;
            <CircularProgress />
          </Box>
        </>
      )}
    </>
  );
};

export default App;
