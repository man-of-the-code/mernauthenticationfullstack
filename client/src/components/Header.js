import React, { useContext, useState } from "react";
import "./header.css";
import Avatar from "@mui/material/Avatar";
import { LoginContext } from "./ContextProvider/Context";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [logindata, setLoginData] = useContext(LoginContext);
  //console.log(logindata);

  const history = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  // const [anchorEl, setAnchorEl] =
  //   (React.useState < null) | (HTMLElement > null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goDash = () => {
    history("/dash");
  };
  const logoutuser = async () => {
    const token = localStorage.getItem("logintoken");
    const res = await fetch("/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    //console.log(data);
    if (data.status === 201) {
      //console.log("user logout");
      localStorage.removeItem("logintoken");
      setLoginData(false);
      history("/");
    } else {
      history("*");
    }
  };
  const goError = () => {
    history("*");
  };

  return (
    <>
      <header>
        <nav>
          <h1>Hp Cloud</h1>
          <div className="avtar">
            {logindata.validUser ? (
              <Avatar
                style={{
                  background: "salmon",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
                onClick={handleClick}
              >
                {logindata.validUser.fname[0].toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                style={{
                  background: "blue",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
                onClick={handleClick}
              />
            )}
          </div>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {logindata.validUser ? (
              <>
                <MenuItem
                  onClick={() => {
                    goDash();
                    handleClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logoutuser();
                    handleClose();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    goError();
                    handleClose();
                  }}
                >
                  Profile
                </MenuItem>
              </>
            )}
          </Menu>
        </nav>
      </header>
    </>
  );
};

export default Header;
