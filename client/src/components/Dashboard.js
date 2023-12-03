import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Dashboard = () => {
  const [Data, setData] = useState(false);
  const [logindata, setLoginData] = useContext(LoginContext);
  //console.log(logindata);
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
    if (data.status === 401 || !data) {
      history("*");
    } else {
      history("/dash");
      setLoginData(data);
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="https://th.bing.com/th/id/R.80c441e6a1b1dab9a36456c229d41045?rik=s6M2wo6SIMOhag&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_553934.png&ehk=%2f1%2fCOsrpWNodsXWFisZ5vApYlOxzC7PW4HL7Yokg7Go%3d&risl=&pid=ImgRaw&r=0"
              style={{ width: "200px", marginTop: 20 }}
              alt=""
            />
            <h1>
              {logindata.validUser
                ? "User Email: " + logindata.validUser.email
                : ""}
            </h1>
          </div>
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

export default Dashboard;
