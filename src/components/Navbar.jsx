import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/auth.context";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

function MyNavbar({
  setHowToFunction,
  setVisibleComponent,
  handleSetButton,
  setAddVisible,
}) {
  const navigate = useNavigate();

  const { isUserActived, verifyToken, handdleLogout } = useContext(AuthContext);

  const location = useLocation();
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (location.pathname === "/" && shouldScroll) {
      scrollToBottom();
      setShouldScroll(false);
    }
  }, [location.pathname, shouldScroll]);

  const handleComoFuncionaClick = () => {
    setShouldScroll(true);
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const gotoHome = () => {
    setVisibleComponent(1);
    setHowToFunction(true);
    setAddVisible(true);
  };
  const ejectHandLogOut = () => {
    handdleLogout();
    navigate("/");
  };

  return (
    <div>
      {isUserActived === false ? (
        <Container className="navbar">
          <div>
          <Navbar.Brand href="#home">
            <img
              src="src/assets/logo_compramos_juntos.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
              style={{ width: "60px", height: "60px" }}
            />
          </Navbar.Brand>
          </div>
          <Nav.Link
            onClick={() => handleSetButton(2)}
            style={{ fontWeight: "bold" }}
          >
            Resgistrarse
          </Nav.Link>
        </Container>
      ) : (
        <Container className="navbar">
          <div>
            <Navbar.Brand href="#home">
              <Link to="/" onClick={gotoHome}>
                <img
                  src="/public/logo_compramos_juntos.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                  style={{ width: "60px", height: "60px" }}
                />
              </Link>
            </Navbar.Brand>
          </div>
          <div style={{ fontWeight: "bold" }}>
            <Link to={"/mygroups"} style={{ color: "black" }}>
              Mis grupos
            </Link>
          </div>
          <div style={{ fontWeight: "bold" }}>
            <Link
              to={"/"}
              onClick={handleComoFuncionaClick}
              style={{ color: "black" }}
            >
              Como funciona
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontWeight: "bold",
            }}
          >
            <Nav.Link style={{ fontWeight: "bold" }}>
              <Link to="/myprofile" style={{ color: "black" }}>
                Mi perfil
              </Link>
            </Nav.Link>
            {" / "}
            <Nav.Link onClick={ejectHandLogOut} style={{ fontWeight: "bold" }}>
              Cerrar sesion
            </Nav.Link>
          </div>
        </Container>
      )}
    </div>
  );
}

export default MyNavbar;
